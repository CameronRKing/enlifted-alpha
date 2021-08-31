import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../_snowpack/pkg/mithril.js';
import stream from '../_snowpack/pkg/mithril/stream.js';
import AppShell from '../src/atoms/nav/AppShell.m.js';

const MobileShell = m.cmp({
    width: 375,
    height: 812,
    scaleFactor: 0.6,

    wrapperStyle() {
        return {
            width: this.width * this.scaleFactor + 'px',
            margin: '8px'
        };
    },

    outlineStyle() {
        return {
            width: this.width + 'px',
            height: this.height + 'px',
            border: '1px solid white',
            transform: `scale(${this.scaleFactor})`,
            'transform-origin': 'top left'
        };
    },

    view: function MobileShell(vnode) {
        this.sync(vnode, ["ctx", 'cmp']);
        return m("div", {
            "style": this.wrapperStyle.bind(this)()
        }, [m("div", {
            "class": "header tc-white bold"
        }, [...vnode.children]), m("div", {
            "style": this.outlineStyle.bind(this)(),
            "class": "dfc js"
        }, [m(AppShell, {
            ctx: this.ctx,
            "cmp": this.cmp
        })])]);
    }
}, (cmp) => __cmps__['MobileShell'] = cmp);

export default MobileShell;

export let states = {
    base: { view: function (vnode) { return m(MobileShell); } }
};

export let tests = (o, mq) => {
    o.spec('MobileShell', () => {
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