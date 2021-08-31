import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../_snowpack/pkg/mithril.js';
import Btn from './Btn.m.js';

const Fab = m.cmp({
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
}, (cmp) => __cmps__['Fab'] = cmp);

export default Fab;

export let states = {
    base: m.cmp({
        view: function base(vnode) {
            this.sync(vnode, ["ctx"]);
            return m(Fab, {
                ctx: this.ctx
            });
        }
    }, (cmp) => __cmps__['base'] = cmp)
};

export let tests = (o, mq) => {
/*
    o.spec('Group name', () => {
        o('Test name', () => {
            o(true).equals(true)`this message displays on assertion failure`
        });
    });
*/
}
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