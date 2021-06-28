import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import TagCategoryEdit from '../molecules/TagCategory/Edit.m.js';
import Home from './Home.m.js';
import TagCategory from '../models/TagCategory.ts.proxy.js';

const UserSettings = {
    setup(vnode) {
        this.sync(vnode, ["ctx"]);
        this.ctx.topNavConfig({
            left: {
                icon: {
                    is: 'arrow-left',
                    color: 'white',
                    onclick: () => this.ctx.setView(Home)
                }
            }
        });
        this.ctx.bgColor('black');
        this.ctx.bottomNavBgColor('black');
        this.category = TagCategory.None;
    },
    view: function UserSettings(vnode) {
        this.sync(vnode, ["ctx"]);
        return m(TagCategoryEdit, {
            ctx: this.ctx,
            "category": this.category
        });
    }
};

export default UserSettings;

export const states = {
    base: { view: function (vnode) { return m(UserSettings); } }
};

export const tests = (o, mq) => {
    o.spec('UserSettings', () => {
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
        reassign(UserSettings, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === UserSettings).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}