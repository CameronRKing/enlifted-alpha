import * as __SNOWPACK_ENV__ from './_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from './_snowpack/pkg/mithril.js';

const Sidebar = {
    view({ attrs }) {
        return m('ul', attrs.tree.map(node =>
            m('li', { class: this.selected === node ? 'selected' : '' },
                m('span.wf', { onclick: () => attrs.onselect(node) }, node.name),
                m('br'),
                node.children && node.children.length ? m(Sidebar, { tree: node.children, onselect: attrs.onselect }) : null
            )
        ));
    }
};

export default Sidebar;

export const states = {};
if (undefined /* [snowpack] import.meta.hot */ ) {
    undefined /* [snowpack] import.meta.hot */ .accept(({ module }) => {
        const reassign = (stale, fresh) => {
            Object.keys(stale).forEach(key => delete stale[key]);
            Object.assign(stale, fresh);
        }
        // for this to work effectively, m.js files should quietly export a list of their known components

        // updates will catch, but they won't rerun lifecycle methods
        reassign(Sidebar, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Sidebar).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}