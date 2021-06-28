import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import Icon from '../Icon.m.js';
import MicBtn from '../MicBtn.m.js';
import Home from '../../views/Home.m.js';
import Flows from '../../views/FlowGallery.m.js';
import QuickEntry from '../../views/QuickEntry.m.js';

const BottomNav = {
    iconColor(cmp) {
        return this.ctx.currView() === cmp ? this.selectedColor() : 'gray-forty'; 
    },

    selectedColor() {
        return {
            black: 'white',
            white: 'black'
        }[this.bgColor];
    },

    dotStyle() {
        return `w1 h1 mt2 br1 bg-${this.selectedColor()}`
    },

    innerStyle() {
        return `df jb aic pb7 px18 bg-${this.bgColor}`;
    },

    view: function BottomNav(vnode) {
        this.sync(vnode, ["ctx", 'bgColor']);
        return m("div", {
            "class": this.innerStyle.bind(this)()
        }, [m("div", {
            "class": "dfc aic"
        }, [m(Icon, {
            ctx: this.ctx,
            "is": "home",
            "color": this.iconColor.bind(this)(Home),
            "onclick": () => this.ctx.setView(Home)
        }), this.ctx.currView() === Home ? m("div", {
            "class": this.dotStyle.bind(this)()
        }) : null]), m(MicBtn, {
            ctx: this.ctx,
            "onclick": () => this.ctx.setView(QuickEntry)
        }), m("div", {
            "class": "dfc aic"
        }, [m(Icon, {
            ctx: this.ctx,
            "is": "whistle",
            "color": this.iconColor.bind(this)(Flows),
            "onclick": () => this.ctx.setView(Flows)
        }), this.ctx.currView() === Flows ? m("div", {
            "class": this.dotStyle.bind(this)()
        }) : null])]);
    }
};

export default BottomNav;

export const states = {
    base: { view: function (vnode) { return m(BottomNav); } }
};

export const tests = (o, mq) => {
    o.spec('BottomNav', () => {
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
        reassign(Bottom, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Bottom).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}