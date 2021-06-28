import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';

const ColorDef = {
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
};

export default ColorDef;

export const states = {
    base: { view: function (vnode) { return m(ColorDef); } }
};

export const tests = (o, mq) => {
    o.spec('ColorDef', () => {
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
        reassign(ColorDef, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === ColorDef).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}