import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import Btn from './Btn.m.js';
import Icon from './Icon.m.js';

const MicBtn = {
    setup(vnode) {
        this.sync(vnode, ["ctx", 'onclick']);
        this.ready = stream(false);

        this.ctx.audioInput.ready.then(() => this.ready(true));
        this.loader = this.ctx.audioInput.loader;

        stream.lift(m.redraw, this.ready, this.loader);
    },

    click() {
        if (!this.ready()) return;

        this.onclick();
    },

    color() {
        return this.ready() ? 'white' : 'gray-twenty';
    },

    style() {
        return { width: this.loader() + '%' };
    },

    view: function MicBtn(vnode) {
        this.sync(vnode, ["ctx", 'onclick']);
        return m(Btn, {
            ctx: this.ctx,
            "class": "w14 h14 br6 bsh4",
            "color": "white",
            "onclick": this.click.bind(this)
        }, [m("div", {
            "class": "dfc jc aic"
        }, [m(Icon, {
            ctx: this.ctx,
            "is": "mic",
            "color": "primary-warm"
        }), !this.ready() ? m("div", {
            "style": "margin-left: -2px;",
            "class": "w10 h1 mt1 bg-success-thirty"
        }, [m("div", {
            "class": "h1 bg-success",
            "style": { width: this.loader() + '%' }
        })]) : null])]);
    }
};

export default MicBtn;

export const states = {
    base: { view: function (vnode) { return m(MicBtn); } }
};

export const tests = (o, mq) => {
    o.spec('MicBtn', () => {
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
        reassign(MicBtn, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === MicBtn).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}