import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';

const Btn = {
    view: function Btn(vnode) {
        this.sync(vnode, ["ctx"]);
        return m("ion-button", {
            "class": "br10",
            ...vnode.attrs
        }, [...vnode.children]);
    }
};

export default Btn;

export const states = {
    outline: {
        view:  function outline(vnode) {
            this.sync(vnode, ["ctx"]);
            return m(Btn, {
                ctx: this.ctx,
                "color": "primary",
                "fill": "outline"
            }, [`Hello, world!`]);
        }
    },
    solid: {
        view: function solid(vnode) {
            this.sync(vnode, ["ctx"]);
            return m(Btn, {
                ctx: this.ctx,
                "color": "primary-medium",
                "fill": "solid"
            }, [`As a rock`]);
        }
    }
};

export const tests = (o, mq) => o.spec('Btn', () => {
    // o('Fires onclick', () => {
    //     const spy = o.spy();
    //     const btn = mq(m(Btn, { attrs: { onclick: spy } }));
    //     btn.click('ion-button');
    //     o(spy.callCount).equals(1);
    // });
})
if (undefined /* [snowpack] import.meta.hot */ ) {
    undefined /* [snowpack] import.meta.hot */ .accept(({ module }) => {
        const reassign = (stale, fresh) => {
            Object.keys(stale).forEach(key => delete stale[key]);
            Object.assign(stale, fresh);
        }
        // for this to work effectively, m.js files should quietly export a list of their known components

        // updates will catch, but they won't rerun lifecycle methods
        reassign(Btn, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Btn).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}