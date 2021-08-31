import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import Icon from '../Icon.m.js';

const TopNav = m.cmp({
    view: function TopNav(vnode) {
        this.sync(vnode, ["ctx", 'config']);
        return m("div", {
            "class": "h14 minh14"
        }, [m("div", {
            "class": "fixed wf py4 df jb aic"
        }, [m("div", {
            "class": "df js aic w33p"
        }, [this.config.left ? m(this.config.left.is, {
            ctx: this.ctx,
            ...this.config.left.props
        }, [`${this.config.left.content || ''}`]) : null]), m("span", {
            "class": "df jc aic w33p"
        }, [this.config.center ? m(this.config.center.is, {
            ctx: this.ctx,
            ...this.config.center.props
        }, [`${this.config.center.content || ''}`]) : null]), m("div", {
            "class": "df je aic w33p"
        }, [m.trust("&nbsp;"), this.config.right ? m(this.config.right.is, {
            ctx: this.ctx,
            ...this.config.right.props
        }, [`${this.config.right.content || ''}`]) : null])])]);
    }
}, (cmp) => __cmps__['TopNav'] = cmp);

export default TopNav;

export let states = {
    base: { view: function (vnode) { return m(TopNav); } }
};

export let tests = (o, mq) => {
    o.spec('TopNav', () => {
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