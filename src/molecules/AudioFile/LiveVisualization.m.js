import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import Konva from '../../../_snowpack/pkg/konva.js';
import { colors } from '../../theme/css-utils.css.js.js';
import AudioConfig from '../../models/builtin/AudioConfig.ts.proxy.js';

const LiveAudioVisualization = {
    // arbitrary numbers from figma
    height: 364,

    barWidth: 8,
    barSpacing: 16,
    numBars: 0,

    // width is saved from the rendered DOM
    width: null,

    maxVolume: AudioConfig.MAX_VOLUME,
    stage: null,
    layer: null,
    lastSync: null,
    lastAnimation: Promise.resolve(),

    oncreate(vnode) {
        this.rects = []; // has to be set in a method, otherwise object will be shared across components
        this.stage = new Konva.Stage({
            container: vnode.dom,
            width: vnode.dom.offsetWidth,
            height: this.height
        });
        this.layer = new Konva.Layer();
        this.stage.add(this.layer);

        this.width = vnode.dom.offsetWidth;
        // add some padding so bars disappear offscreen before being transported
        this.numBars = Math.ceil(this.width / (this.barWidth + this.barSpacing)) + 2;

        // for (let ii = 0; ii < this.numBars; ii++) {
        //     const rect = new Konva.Rect({
        //         x: ii * (this.barWidth + this.barSpacing),
        //         y: ,
        //         width: 8,
        //         height: 4,
        //         fill: colors['primary-medium'],
        //     });
        //     this.rects.push(rect);
        //     this.layer.add(rect);
        // }

        this.layer.draw();
    },

    onsync() {
        if (!this.numBars || !this.peaks.length) return;
        if (!this.lastSync) this.lastSync = Date.now();

        let duration = (Date.now() - this.lastSync) / 1000;
        // use the same duration if it's close enough to avoid little hiccups in the animation
        // (doesn't actually work)
        // if (Math.abs(duration - this.lastDuration) < 0.02) {
        //     duration = this.lastDuration;
        // }
        const nextPeak = this.peaks.slice(-1)[0];
        this.lastAnimation = this.lastAnimation.then(() => {
            let nextRect;
            if (this.rects.length === this.numBars) {
                // reuse rectangles by moving them from the end to the start
                nextRect = this.rects.shift();
            } else {
                // or create them when necessary
                nextRect = new Konva.Rect({
                    fill: colors['primary-medium'],
                    width: this.barWidth,
                    cornerRadius: 4,
                });
                this.layer.add(nextRect);
            }
            this.rects.push(nextRect);
            const middle = this.height / 2;
            const barHeight = this.height * (nextPeak / this.maxVolume);
            const topOfBar = middle - (barHeight / 2);
            // top left corner is (0,0)
            // x is positive to the right
            // y is positive to the bottom
            nextRect.x(this.width - this.barWidth);
            nextRect.y(topOfBar);
            nextRect.height(barHeight);

            this.rects.forEach(node => {
                new Konva.Tween({
                    node,
                    duration,
                    x: node.x() - (this.barWidth + this.barSpacing)
                }).play();
            });

            this.lastSync = Date.now();

            return new Promise(resolve => setTimeout(resolve, duration * 1000));
        });
    },

    view: function LiveAudioVisualization(vnode) {
        this.sync(vnode, ["ctx", 'peaks']);
        return m("div", {
            "style": { height: this.height + 'px' }
        }, []);
    }
};

export default LiveAudioVisualization;

const peaks1 = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const peaks2 = peaks1.map(val => val - 5);
export const states = {
    base: {
        peaks: peaks1.concat(peaks2, peaks1),
        interval: null,
        start() {
            this.interval = setInterval(() => {
                this.peaks.push(this.peaks.shift());
                m.redraw();
            }, 120);
        },
        stop() {
            clearInterval(this.interval);
        },
        oninit(vnode) {
            this.sync(vnode, ["ctx"]);
            this.start();
        },
        onremove(vnode) {
            this.stop();
        },
        view: function base(vnode) {
            this.sync(vnode, ["ctx"]);
            return m("div", {
                "class": "h64"
            }, [m(LiveAudioVisualization, {
                ctx: this.ctx,
                "peaks": this.peaks
            })]);
        }
    },
    test: {
        setup(vnode) {
            this.sync(vnode, ["ctx"]);
            // https://konvajs.org/api/Konva.Animation.html
            document.body.style.setProperty('--test-trans', '');
            document.body.style.setProperty('--test-time', 'all 5s');
            stream.after(1000).map(() => {
                document.body.style.setProperty('--test-trans', 'translate(200px)');
            });
            stream.after(2000).map(() => document.body.style.setProperty('--test-time', 'all 1` 1s'));
        },
        view: function test(vnode) {
            this.sync(vnode, ["ctx"]);
            return m("div", {
                "class": "tc-white",
                "style": "transform: var(--test-trans); transition: var(--test-time)"
            }, [`do I work?`]);
        }
    }
};

export const tests = (o, mq) => {
    /*
        o.spec('Group name', () => {
            o('Test name', () => {
                o(true).equals(true)`this message displays on assertion failure`
            });
        });
    */
}
if (undefined /* [snowpack] import.meta.hot */ ) {
    undefined /* [snowpack] import.meta.hot */ .accept(({ module }) => {
        const reassign = (stale, fresh) => {
            Object.keys(stale).forEach(key => delete stale[key]);
            Object.assign(stale, fresh);
        }
        // for this to work effectively, m.js files should quietly export a list of their known components

        // updates will catch, but they won't rerun lifecycle methods
        reassign(LiveVisualization, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === LiveVisualization).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}