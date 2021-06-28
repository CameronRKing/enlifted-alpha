import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../../_snowpack/pkg/mithril.js';
import stream from '../../../../_snowpack/pkg/mithril/stream.js';
import { Duration } from '../../../../_snowpack/pkg/luxon.js';
import Icon from '../../../atoms/Icon.m.js';
import AudioPlayer from './Controller.js';

const AudioFilePlayer = {
    // assumed to be a stream
    audioFile: stream(null),

    player: stream(null),
    barWidth: 4,
    barSpacing: 2,
    numBars: stream(0),
    toDisplay: stream([]),
    icon: stream('play'),
    isPlaying: stream(false),
    timeRemaining: stream(Duration.fromObject({ minutes: 0, seconds: 0 })),
    seeking: stream(false),

    setup(vnode) {
        this.sync(vnode, ["ctx", 'audioFile']);
        this.player = this.audioFile.map(audio => audio ? new AudioPlayer(audio.file) : null);

        // sync player state
        this.player.map(player => {
            if (!player) return;
            player.isPlaying.map(this.isPlaying);
            player.timeRemaining.map(this.timeRemaining);
        });
        // I don't understand why yet, but Icons aren't updating when :is changes
        // this.isPlaying.map(isPlaying => {
        //     this.icon(isPlaying ? 'pause' : 'play');
        //     m.redraw();
        // });

        // gather peaks for display
        this.toDisplay = stream([]);
        this.displaySync = stream.lift(async (player, numBars) => {
            if (!player) {
                this.toDisplay([]);
                return;
            };

            if (numBars === 0) return;

            await player.ready();
            this.toDisplay(await player.peaks(numBars));
        }, this.player, this.numBars);

        // redraw when relevant data changes
        stream.lift(() => m.redraw(), this.isPlaying, this.toDisplay, this.timeRemaining);
    },

    oncreate(vnode) {
        const width = this.barWrapper.dom.offsetWidth;
        const bars = Math.floor(width / (this.barWidth + this.barSpacing));
        this.numBars(bars - 8);
    },

    barClass(idx) {
        return `bg-${this.hasBeenPlayed(idx) ? 'primary-medium' : 'white'}`;
    },

    barStyle(peak) {
        return `width: ${this.barWidth}px;
        margin-right: ${this.barSpacing}px;
        height: ${peak * 100}%;`;
    },

    hasBeenPlayed(idx) {
        if (this.numBars() === 0) return false;
        const peakTimestamp = idx / this.numBars() * (this.audioFile().length.as('seconds'));
        // console.log(idx, peakTimestamp, this.player()._currentTime().as('seconds'));
        return peakTimestamp <= this.player()._currentTime().as('seconds');
    },

    seek(event) {
        if (!this.seeking()) return;
        const { x } = event;
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
            "onclick": () => this.player().toggle()
        }, [!this.isPlaying() ? m(Icon, {
            ctx: this.ctx,
            "is": "play",
            "color": "white"
        }) : null, this.isPlaying() ? m(Icon, {
            ctx: this.ctx,
            "is": "pause",
            "color": "white"
        }) : null]), (() => { this["barWrapper"] = m("div", {
            "class": "fg1 hf df aic jb",
            "onmousedown": () => this.seeking(true),
            "onmouseup": () => this.seeking(false),
            "onmousemove": this.seek.bind(this),
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
};

export default AudioFilePlayer;

export const states = {
    base: { view: function (vnode) { return m(AudioFilePlayer); } }
};

export const tests = (o, mq) => {
    o.spec('AudioFilePlayer', () => {
        o('Does stuff', () => {
            o(true).equals(false, 'Message displays on assertion failure');
        });
    });
};
if (undefined /* [snowpack] import.meta.hot */ ) {
    undefined /* [snowpack] import.meta.hot */ .accept(({ module }) => {
        const reassign = (stale, fresh) => {
            Object.keys(stale).forEach(key => delete stale[key]);
            Object.assign(stale, fresh);
        }
        // for this to work effectively, m.js files should quietly export a list of their known components

        // updates will catch, but they won't rerun lifecycle methods
        reassign(index, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === index).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}