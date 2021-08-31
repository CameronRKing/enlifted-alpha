import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../_snowpack/pkg/mithril.js';

const Btn = m.cmp({
    view: function Btn(vnode) {
        this.sync(vnode, ["ctx"]);
        return m("ion-button", {
            "class": "br10",
            ...vnode.attrs
        }, [...vnode.children]);
    }
}, (cmp) => __cmps__['Btn'] = cmp);

export default Btn;

export let states = {
    outline: m.cmp({
        view:  function outline(vnode) {
            this.sync(vnode, ["ctx"]);
            return m(Btn, {
                ctx: this.ctx,
                "color": "primary",
                "fill": "outline"
            }, [`Hello, world!`]);
        }
    }, (cmp) => __cmps__['outline'] = cmp),
    solid: m.cmp({
        view: function solid(vnode) {
            this.sync(vnode, ["ctx"]);
            return m(Btn, {
                ctx: this.ctx,
                "color": "primary-medium",
                "fill": "solid"
            }, [`As a rock`]);
        }
    }, (cmp) => __cmps__['solid'] = cmp)
};

export let tests = (o, mq) => o.spec('Btn', () => {
    // o('Fires onclick', () => {
    //     const spy = o.spy();
    //     const btn = mq(m(Btn, { attrs: { onclick: spy } }));
    //     btn.click('ion-button');
    //     o(spy.callCount).equals(1);
    // });
})
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