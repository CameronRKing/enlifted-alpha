import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import BottomNav from '../atoms/nav/Bottom.m.js';
import EntryList from '../molecules/AudioEntry/List/index.js';
import EntryDetail from './EntryDetail.m.js';
import UserSettings from './UserSettings.m.js';
import { DateTime } from '../../_snowpack/pkg/luxon.js';


const Home = {
    setup(vnode) {
        this.sync(vnode, ["ctx", 'animation', 'withAnnotation']);
        this.activeFilters = this.$sessionData('Home', 'activeFilters', () => stream([]));

        this.ctx.bgColor('thoughtful-alt');
        this.ctx.bottomNavVisible(true);
        this.ctx.bottomNavBgColor('black');
        this.ctx.topNavVisible(true);
        this.ctx.topNavConfig({
            left: {
                icon: {
                    is: 'settings',
                    onclick: () => this.ctx.setView(UserSettings)
                }
            }
        });
    },

    animateClass() {
        const base = 'hf';
        if (!this.animation) return base;

        return base + ' animate__animated animate__' + this.animation;
    },

    view: function Home(vnode) {
        this.sync(vnode, ["ctx", 'animation', 'withAnnotation']);
        return m("div", {
            "class": this.animateClass.bind(this)()
        }, [m("div", {
            "class": "sm-body tc-gray-twenty"
        }, [`${DateTime.now().toFormat('EEEE MMMM d, y')}`]), m("div", {
            "class": "title body-font tc-white bold mt2 mb3"
        }, [`Good morning!`]), m(EntryList, {
            ctx: this.ctx,
            "onselect": entry => this.ctx.setView(EntryDetail, { entry }),
            "activeFilters": this.activeFilters
        }), this.withAnnotation ? m("div", {
            "class": "pa ma b12 l0 r0 dfc aic"
        }, [m("div", {
            "class": "px2 sm-body bg-white tc-black"
        }, [`Tap to record your first entry`]), m("div", {
            "class": "arrow-down"
        })]) : null]);
    }
};

export default Home;

export const states = {
    base: { view: function base(vnode) {
        this.sync(vnode, ["ctx"]);
        return m(Home, {
            ctx: this.ctx
        });
    } },
    onboard: { view: function onboard(vnode) {
        this.sync(vnode, ["ctx"]);
        return m(Home, {
            ctx: this.ctx,
            "withAnnotation": true,
            "animation": "fadeInUp"
        });
    } }
};

export const tests = (o, mq) => {
    o.spec('Home', () => {
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
        reassign(Home, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Home).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}