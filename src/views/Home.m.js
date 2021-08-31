import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import BottomNav from '../atoms/nav/Bottom.m.js';
import Icon from '../atoms/Icon.m.js';
import EntryList from '../molecules/AudioEntry/List/index.js';
import EntryDetail from './EntryDetail.m.js';
import UserSettings from './UserSettings.m.js';
import { DateTime } from '../../_snowpack/pkg/luxon.js';


const Home = m.cmp({
    pageConfig() {
        this.ctx.bgColor('thoughtful-alt');
        this.ctx.bottomNavVisible(true);
        this.ctx.bottomNavBgColor('black');
        this.ctx.topNavVisible(true);
        this.ctx.topNavConfig({
            left: {
                is: Icon,
                props: {
                    is: 'settings',
                    onclick: () => {
                        this.ctx.analytics.emit('Profile/Settings');
                        this.ctx.screenStack.add(UserSettings, 'left');
                    }
                }
            }
        });
    },

    setup(vnode) {
        this.sync(vnode, ["ctx", 'animation', 'withAnnotation']);
        this.activeFilters = this.ctx.session.Home().activeFilters;
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
            "onselect": entry => { this.ctx.analytics.emit('Entry Detail'); this.ctx.screenStack.add(EntryDetail, 'left', { entry }); },
            "activeFilters": this.activeFilters
        }), this.withAnnotation ? m("div", {
            "class": "pa ma b24 l0 r0 dfc aic"
        }, [m("div", {
            "class": "px2 sm-body bg-white tc-black"
        }, [`Tap to record your first entry`]), m("div", {
            "class": "arrow-down"
        })]) : null]);
    }
}, (cmp) => __cmps__['Home'] = cmp);

export default Home;

export let states = {
    base: m.cmp(
        { pageConfig() { Home.pageConfig.call(this); }, view: function base(vnode) {
            this.sync(vnode, ["ctx"]);
            return m(Home, {
                ctx: this.ctx
            });
        } },
        (cmp) => __cmps__['base'] = cmp
    ),
    onboard: m.cmp(
        { pageConfig() { Home.pageConfig.call(this); }, view: function onboard(vnode) {
            this.sync(vnode, ["ctx"]);
            return m(Home, {
                ctx: this.ctx,
                "withAnnotation": true,
                "animation": "fadeInUp"
            });
        } },
        (cmp) => __cmps__['onboard'] = cmp
    )
};

export let tests = (o, mq) => {
    o.spec('Home', () => {
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