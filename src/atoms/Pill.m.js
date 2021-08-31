import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';

const Pill = m.cmp({
    setup(vnode) {
        this.sync(vnode, ["ctx", 'style']);
        this.innerStyle = this.$withStyle(this, 'nowrap brss brw2 br-secondary-cool br8 py2 m1 px4 bg-transparent tc-secondary-cool bold');
    },

    view: function Pill(vnode) {
        this.sync(vnode, ["ctx", 'style']);
        return m("span", {
            ...vnode.attrs,
            "class": this.innerStyle()
        }, [...vnode.children]);
    }
}, (cmp) => __cmps__['Pill'] = cmp);

export default Pill;

export let states = {
    base: { view: function (vnode) { return m(Pill); } }
};

export let tests = (o, mq) => {
    o.spec('Pill', () => {
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