import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import Icon from '../atoms/Icon.m.js';
import TagCategoryEdit from '../molecules/TagCategory/Edit.m.js';
import Home from './Home.m.js';
import TagCategory, { NoneReady } from '../models/TagCategory.js';

const UserSettings = m.cmp({
    setup(vnode) {
        this.sync(vnode, ["ctx"]);
        this.ctx.topNavConfig({
            left: {
                is: Icon,
                props: {
                    is: 'arrow-left',
                    color: 'white',
                    onclick: () => { this.ctx.analytics.emit('Return'); this.ctx.screenStack.pop(); }
                }
            }
        });
        this.ctx.bgColor('black');
        this.ctx.bottomNavBgColor('black');
        this.ready = false;
        NoneReady.then(() => {
            this.category = TagCategory.None;
            this.ready = true;
            m.redraw();
        });
    },
    view: function UserSettings(vnode) {
        this.sync(vnode, ["ctx"]);
        return this.ready ? m(TagCategoryEdit, {
            ctx: this.ctx,
            "category": this.category
        }) : null;
    }
}, (cmp) => __cmps__['UserSettings'] = cmp);

export default UserSettings;

export let states = {
    base: { view: function (vnode) { return m(UserSettings); } }
};

export let tests = (o, mq) => {
    o.spec('UserSettings', () => {
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