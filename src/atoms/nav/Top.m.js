import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import Icon from '../Icon.m.js';

const TopNav = {
    view: function TopNav(vnode) {
        this.sync(vnode, ["ctx", 'config']);
        return m("div", {
            "class": "h14 minh14"
        }, [m("div", {
            "class": "fixed wf py4 df jb aic"
        }, [m("div", {
            "class": "df js aic w33p"
        }, [this.config.left && this.config.left.icon ? m(Icon, {
            ctx: this.ctx,
            ...this.config.left.icon
        }) : null, this.config.left && this.config.left.span ? m("span", {
            ...this.config.left.span.props
        }, [`${this.config.left.span.content}`]) : null]), m("span", {
            "class": "df jc aic w33p"
        }, [this.config.center ? m(this.config.center.is, {
            ctx: this.ctx,
            ...this.config.center.props
        }) : null]), m("div", {
            "class": "df je aic w33p"
        }, [m.trust("&nbsp;"), this.config.right && this.config.right.icon ? m(Icon, {
            ctx: this.ctx,
            ...this.config.right.icon
        }) : null, this.config.right && this.config.right.span ? m("span", {
            ...this.config.right.span.props
        }, [`${this.config.right.span.content}`]) : null])])]);
    }
};

export default TopNav;

export const states = {
    base: { view: function (vnode) { return m(TopNav); } }
};

export const tests = (o, mq) => {
    o.spec('TopNav', () => {
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
        reassign(Top, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Top).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}