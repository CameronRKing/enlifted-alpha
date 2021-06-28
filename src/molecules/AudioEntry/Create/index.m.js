import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../../_snowpack/pkg/mithril.js';
import LiveAudioVisualization from '../../AudioFile/LiveVisualization.m.js';
import Btn from '../../../atoms/Btn.m.js';
import Fab from '../../../atoms/Fab.m.js';
import Icon from '../../../atoms/Icon.m.js';
import { colors } from '../../../theme/css-utils.css.js.js';

import Session from './Session.js';

const AudioCapture = {
    setup(vnode) {
        this.sync(vnode, ["ctx", 'filename', 'oncancel', 'onfinish']);
        this.ctx.topNavConfig({
            left: {
                icon: {
                    is: 'cross',
                    onclick: () => this.oncancel()
                }
            },
            center: {
                is: Icon,
                props: {
                    is: 'logo',
                    color: colors.radical
                }
            }
        });

        const { audioInput } = this.ctx;
        this.session = new Session(audioInput);
    },

    oncreate() {
        // auto-start
        this.toggle();
    },

    onremove() {
        this.session.teardown();
    },

    async toggle() {
        await this.session.toggle();
        // Still need to upgrade mithril to redraw on async handlers
        m.redraw();
    },

    async finish() {
        this.onfinish(await this.session.finish());
    },

    view: function AudioCapture(vnode) {
        this.sync(vnode, ["ctx", 'filename', 'oncancel', 'onfinish']);
        return m("div", {
            "class": "dfc jb hf"
        }, [m("div", {
            "class": "df jc header bold italic tc-primary-medium pt12"
        }, [vnode.attrs.prompt]), m(LiveAudioVisualization, {
            ctx: this.ctx,
            "peaks": this.session.peaks
        }), m("div", {
            "class": "pb15 sm-body"
        }, [m("div", {
            "class": "df ja aic italic"
        }, [!this.session.isRecording ? m(Btn, {
            ctx: this.ctx,
            "data-mq": "redo",
            "fill": "transparent",
            "class": "bold sm-body",
            "onclick": () => this.session.restart()
        }, [`Redo`]) : null, m(Fab, {
            ctx: this.ctx,
            "data-mq": "toggle",
            "size": "large",
            "fill": "solid",
            "color": "primary-medium",
            "class": "bold sm-body br8",
            "onclick": this.toggle.bind(this)
        }, [this.session.isRecording ? m(Icon, {
            ctx: this.ctx,
            "is": "pause"
        }) : null, !this.session.isRecording ? m("span", {
            "class": "p2 sm-body"
        }, [`Resume`]) : null]), !this.session.isRecording ? m(Btn, {
            ctx: this.ctx,
            "data-mq": "finish",
            "fill": "transparent",
            "class": "bold sm-body",
            "onclick": this.finish.bind(this)
        }, [`Finish`]) : null]), m("div", {
            "class": "lg-body tc-gray-sixty bold df jc pt4 h8"
        }, [vnode.attrs.helper])])]);
    }
};

export default AudioCapture;
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