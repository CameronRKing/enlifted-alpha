import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import Btn from './Btn.m.js';

const Fab = {
    sizes: {
        small: '40px',
        large: '80px',
    },

    setup(vnode) {
        this.sync(vnode, ["ctx", 'size']);
        if (!this.size) this.size = 'small';

        if (!Object.keys(this.sizes).includes(this.size)) throw new Error(`size must be in ${Object.keys(this.sizes)}; "${this.size}" received`);
    },

    onsync() {
        this.innerSize = this.sizes[this.size];
    },

    view: function Fab(vnode) {
        this.sync(vnode, ["ctx", 'size']);
        return m(Btn, {
            ctx: this.ctx,
            "class": "br8",
            ...vnode.attrs,
            "style": { height: this.innerSize, width: this.innerSize }
        }, [...vnode.children]);
    }
};

export default Fab;

export const states = {
    base: {
        view: function base(vnode) {
            this.sync(vnode, ["ctx"]);
            return m(Fab, {
                ctx: this.ctx
            });
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
        reassign(Fab, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Fab).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}