import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import Onboarding from '../models/Onboarding.ts.proxy.js';
import OnboardingView from './Onboarding/index.js';
import Home from './Home.m.js';

const InitialView = {
    async setup(vnode) {
        this.sync(vnode, ["ctx"]);
        const status = await Onboarding.singleton();
        this.ctx.setView(status.initial ? Home : OnboardingView);
    },
    view: function InitialView(vnode) {
        this.sync(vnode, ["ctx"]);
        return m("div");
    }
};

export default InitialView;

export const states = {
    base: { view: function base(vnode) {
        this.sync(vnode, ["ctx"]);
        return m(InitialView, {
            ctx: this.ctx
        });
    } }
};

export const tests = (o, mq) => {
    o.spec('InitialView', () => {
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
        reassign(Initial, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Initial).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}