import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';

const ColorDef = m.cmp({
    gradientTransform: '',

    onsync() {
        if (typeof this.color === 'object') {
            this.gradientTransform = `rotate(${360 - this.color.rotation})`;
        }
    },

    // linear gradients in SVG work differently from CSS
    // to get the same styling as the figma,
    // I have to reverse the start/end and invert the rotation
    view: function ColorDef(vnode) {
        this.sync(vnode, ["ctx", 'color', 'id']);
        return typeof this.color === 'object' ? m("defs", {}, [m("linearGradient", {
            "id": this.id,
            "gradientTransform": this.gradientTransform
        }, [m("stop", {
            "offset": "0%",
            "stop-color": this.color.end
        }), m("stop", {
            "offset": "100%",
            "stop-color": this.color.start
        })])]) : null;
    }
}, (cmp) => __cmps__['ColorDef'] = cmp);

export default ColorDef;

export let states = {
    base: { view: function (vnode) { return m(ColorDef); } }
};

export let tests = (o, mq) => {
    o.spec('ColorDef', () => {
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