import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import Icon from '../Icon.m.js';
import MicBtn from '../MicBtn.m.js';
import Home from '../../views/Home.m.js';
import Flows from '../../views/FlowGallery.m.js';
import QuickEntry from '../../views/QuickEntry.m.js';

const BottomNav = m.cmp({
    setup(vnode) {
        this.sync(vnode, ["ctx", 'bgColor', 'class']);
        this.updating = false;
        this.currView = stream(Home);
    },

    iconColor(cmp) {
        return this.currView() === cmp ? this.selectedColor() : 'gray-forty'; 
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
        return `pa wf b0 df jb aic pb7 px18 bg-${this.bgColor} ${this.class}`;
    },

    set(cmp, dir) {

        this.ctx.screenStack.swap(cmp, dir);
        this.currView(cmp);
    },

    // bottom nav updates are controlled manually
    // because auto-redraw was causing several blinks
    // during each screen change
    forceUpdate() {
        this.updating = true;
        m.redraw();
    },

    onbeforeupdate() {
        if (!this.updating) return false;
        this.updating = false;
        return true;
    },

    view: function BottomNav(vnode) {
        this.sync(vnode, ["ctx", 'bgColor', 'class']);
        return m("div", {
            "class": this.innerStyle.bind(this)()
        }, [m("div", {
            "class": "dfc aic"
        }, [m(Icon, {
            ctx: this.ctx,
            "is": "home",
            "color": this.iconColor.bind(this)(Home),
            "onclick": () => { this.ctx.analytics.emit('Home'); this.set.bind(this)(Home, 'left'); }
        }), this.currView() === Home ? m("div", {
            "class": this.dotStyle.bind(this)()
        }) : null]), m(MicBtn, {
            ctx: this.ctx,
            "onclick": () => { this.ctx.analytics.emit('Quick Record'); this.ctx.screenStack.add(QuickEntry, 'up') }
        }), m("div", {
            "class": "dfc aic"
        }, [m(Icon, {
            ctx: this.ctx,
            "is": "whistle",
            "color": this.iconColor.bind(this)(Flows),
            "onclick": () => { this.ctx.analytics.emit('Flows'); this.set.bind(this)(Flows, 'right'); }
        }), this.currView() === Flows ? m("div", {
            "class": this.dotStyle.bind(this)()
        }) : null])]);
    }
}, (cmp) => __cmps__['BottomNav'] = cmp);

export default BottomNav;

export let states = {
    base: { view: function (vnode) { return m(BottomNav); } }
};

export let tests = (o, mq) => {
    o.spec('BottomNav', () => {
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