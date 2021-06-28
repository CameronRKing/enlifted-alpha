import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import Icon from './Icon.m.js';

const Popup = {
    setup(vnode) {
        this.sync(vnode, ["ctx", 'withExit', 'pos']);
        this.open = stream(false);
        stream.lift(m.redraw, this.open);
    },

    onsync() {
        if (this.pos === undefined) this.pos = 'center';
        if (this.withExit === undefined) this.withExit = true;
    },

    innerStyle() {
        const adjustment = {
            center: 'b0 t0',
            bottom: 'b0',
            top: 't0'
        }[this.pos];

        return `wf hfc bg-black br2 ma p4 pf l0 r0 ${adjustment}`;
    },

    view: function Popup(vnode) {
        this.sync(vnode, ["ctx", 'withExit', 'pos']);
        return this.open() ? m("div", {
            "class": "wf hf pa ma t0 l0 df jc aic bg-blur",
            "style": "z-index: 9998"
        }, [m("div", {
            "class": this.innerStyle.bind(this)()
        }, [m("div", {
            "class": "df jb aic"
        }, [this.withExit ? m("div", {}, [m(Icon, {
            ctx: this.ctx,
            "is": "cross",
            "onclick": () => this.open(false)
        })]) : null, m("div", {
            "class": "sm-body bold tc-white"
        }, [vnode.attrs.header]), m("div", {}, [vnode.attrs.topRight])]), vnode.attrs.body, vnode.attrs.footer])]) : null;
    }
};

export default Popup;

export const states = {
    base: { view: function (vnode) { return m(Popup); } }
};

export const tests = (o, mq) => {
    o.spec('Popup', () => {
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
        reassign(Popup, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Popup).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}