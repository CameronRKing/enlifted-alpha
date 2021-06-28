import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import withStyle from './mixins/withStyle.js';

const SecondaryBtn = {
    setup(vnode) {
        this.sync(vnode, ["ctx", 'style']);
        this.innerStyle = withStyle(vnode.state, 'sm-body tc-secondary-cool')
    },

    view: function SecondaryBtn(vnode) {
        this.sync(vnode, ["ctx", 'style']);
        return m("span", {
            "class": this.innerStyle(),
            ...vnode.attrs
        }, [...vnode.children]);
    }
};

export default SecondaryBtn;

export const states = {
    base: { view: function (vnode) { return m(SecondaryBtn); } }
};

export const tests = (o, mq) => {
    o.spec('SecondaryBtn', () => {
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
        reassign(SecondaryBtn, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === SecondaryBtn).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}