import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import Onboarding from '../models/Onboarding.js';
import OnboardingView from './Onboarding/index.js';
import Home from './Home.m.js';

const InitialView = m.cmp({
    async setup(vnode) {
        this.sync(vnode, ["ctx"]);
        const status = await Onboarding.singleton();
        await this.ctx.screenStack.ready;
        this.ctx.screenStack.add(status.initial ? Home : OnboardingView, 'down');
    },
    view: function InitialView(vnode) {
        this.sync(vnode, ["ctx"]);
        return m("div");
    }
}, (cmp) => __cmps__['InitialView'] = cmp);

export default InitialView;

export let states = {
    base: m.cmp({ view: function base(vnode) {
        this.sync(vnode, ["ctx"]);
        return m(InitialView, {
            ctx: this.ctx
        });
    } }, (cmp) => __cmps__['base'] = cmp)
};

export let tests = (o, mq) => {
    o.spec('InitialView', () => {
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
