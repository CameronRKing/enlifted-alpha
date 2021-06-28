import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import families from '../theme/css-utils.css.js.js';

const classToFamily = Object.entries(families).reduce((acc, [name, family]) => {
    Object.keys(family).forEach(cclass => {
        acc[cclass] = name;
    });
    return acc;
}, {});

const areSiblings = (l, r) => classToFamily[l] === classToFamily[r];

const defaultStyle = 'nowrap brss brw2 br-secondary-cool br8 py2 m1 px4 bg-transparent tc-secondary-cool bold';
const Pill = {
    innerStyle() {
        const defaultClasses = defaultStyle.split(' ');
        const givenClasses = this.style.split(' ');
        const notOverridden = defaultClasses.filter(cclass => {
            const hasSibling = givenClasses.some(given => areSiblings(cclass, given));
            return !hasSibling;
        })
        return [...givenClasses, ...notOverridden].join(' ')
    },

    view: function Pill(vnode) {
        this.sync(vnode, ["ctx", 'style']);
        return m("span", {
            ...vnode.attrs,
            "class": this.innerStyle.bind(this)()
        }, [...vnode.children]);
    }
};

export default Pill;

export const states = {
    base: { view: function (vnode) { return m(Pill); } }
};

export const tests = (o, mq) => {
    o.spec('Pill', () => {
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
        reassign(Pill, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Pill).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}