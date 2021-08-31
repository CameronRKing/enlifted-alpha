import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../../_snowpack/pkg/mithril.js';
import stream from '../../../../_snowpack/pkg/mithril/stream.js';
import { Duration } from '../../../../_snowpack/pkg/luxon.js';
import Icon from '../../../atoms/Icon.m.js';
import AudioPlayer from './Controller.js';

const AudioFilePlayer = m.cmp({
    barWidth: 4,
    barSpacing: 2,

    setup(vnode) {
        this.sync(vnode, ["ctx", 'audioFile']);
        this.numBars = stream(0);
        this.toDisplay = stream([]);
        this.icon = stream('play');
        this.isPlaying = stream(false);
        this.timeRemaining = stream(Duration.fromObject({ minutes: 0, seconds: 0 }));
        this.seeking = stream(false);
        this.seeking.map(isSeeking => isSeeking ? this.ctx.analytics.emit('Scrub Playback') : null);

        this.player = stream();

        this.audioFile.map(async audio => {
            if (!audio) return;
            const player = new AudioPlayer(audio, await audio.url);
            this.player(player);
        });

        // sync player state
        this.player.map(async player => {
            if (!player) return;
            player.isPlaying.map(this.isPlaying);
            player.timeRemaining.map(this.timeRemaining);
        });
        // I don't understand why yet, but Icons aren't updating when :is changes
        this.isPlaying.map(isPlaying => {
            this.icon(isPlaying ? 'pause' : 'play');
            m.redraw();
        });

        // gather peaks for display
        this.toDisplay = stream([]);
        this.displaySync = stream.lift(async (player, numBars) => {
            if (!player || numBars === 0) {
                this.toDisplay([]);
                return;
            };
            this.toDisplay(await player.peaks(numBars));
        }, this.player, this.numBars);

        stream.lift(() => m.redraw(),
            this.isPlaying,
            this.toDisplay, 
            this.timeRemaining
        );
    },

    oncreate(vnode) {
        // have to wait a tick for the elements to resize
        setTimeout(() => {
            const width = this.barWrapper.dom.offsetWidth;
            const bars = Math.floor(width / (this.barWidth + this.barSpacing));
            this.numBars(bars - 8); // eight is a number chosen experimentally to deal with crowding issues
        }, 16);
    },

    barClass(idx) {
        return `bg-${this.hasBeenPlayed(idx) ? 'primary-medium' : 'white'} br1`;
    },

    barStyle(peak) {
        return `width: ${this.barWidth}px;
        margin-right: ${this.barSpacing}px;
        height: ${peak * 100}%;`;
    },

    hasBeenPlayed(idx) {
        if (this.numBars() === 0) return false;
        const peakTimestamp = idx / this.numBars() * (this.audioFile().length.as('seconds'));
        return peakTimestamp < this.player()._currentTime().as('seconds');
    },

    seek(event) {
        // seeking() is set to false when the "mouse" leaves the waveform area
        if (!this.seeking()) return;
        const x = event.changedTouches[0].clientX;
        const { left, width } = this.barWrapper.dom.getBoundingClientRect();
        const placement = (x - left) / width;
        const time = placement * this.audioFile().length.as('seconds');
        this.player().seek(time);
    },

    // don't know why, but the click handler for the icon isn't working
    view: function AudioFilePlayer(vnode) {
        this.sync(vnode, ["ctx", 'audioFile']);
        return m("div", {
            "class": "pf b0 l0 wf h24 bg-gray-eighty"
        }, [m("div", {
            "class": "wf hf pb8 pt2 df jb aic"
        }, [m("div", {
            "class": "pl10 pr7 minw4",
            "onclick": () => { this.ctx.analytics.emit((this.isPlaying() ? 'Pause' : 'Start') + ' Playback'); this.player().toggle(); }
        }, [m(Icon, {
            ctx: this.ctx,
            "is": this.isPlaying() ? 'pause' : 'play',
            "color": "white"
        })]), (() => { this["barWrapper"] = m("div", {
            "class": "fg1 hf df aic jb",
            "ontouchstart": () => this.seeking(true),
            "ontouchend": () => this.seeking(false),
            "ontouchmove": this.seek.bind(this),
            "onmouseleave": () => this.seeking(false)
        }, [...(Array.isArray(this.toDisplay()) ? this.toDisplay().map((peak, idx) => m("div", {
            "class": this.barClass.bind(this)(idx),
            "style": this.barStyle.bind(this)(peak)
        })) : Object.entries(this.toDisplay()).map(([idx, peak]) => m("div", {
            "class": this.barClass.bind(this)(idx),
            "style": this.barStyle.bind(this)(peak)
        })))]); return this["barWrapper"]; })(), m("div", {
            "class": "pr5 pl7"
        }, [`${this.timeRemaining().toFormat('m:ss')}`])])]);
    }
}, (cmp) => __cmps__['AudioFilePlayer'] = cmp);

export default AudioFilePlayer;

export let states = {
    base: { view: function (vnode) { return m(AudioFilePlayer); } }
};

export let tests = (o, mq) => {
    o.spec('AudioFilePlayer', () => {
        o('Does stuff', () => {
            o(true).equals(false, 'Message displays on assertion failure');
        });
    });
};
export { __cmps__ };
if (undefined /* [snowpack] import.meta.hot */ ) {
    undefined /* [snowpack] import.meta.hot */ .accept(({ module })  => {
        const reassign = (stale, fresh) => {
            Object.keys(stale).forEach(key => delete stale[key]);
            Object.assign(stale, fresh);
        }
        // for this to work effectively, m.js files should quietly export a list of their known components

        // this method will force the components to re-render from scratch
        Object.entries(__cmps__).forEach(([name, cmp]) => {
            m.findAll(node => node.tag === cmp)
            .forEach(node => node.tag = module.__cmps__[name])
        });

        Object.entries(module.__cmps__).forEach(([name, cmp]) => reassign(__cmps__[name], cmp));

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { tests = module.tests } catch (e) {}

        m.redraw();
    });
}