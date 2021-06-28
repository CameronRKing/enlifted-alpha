import * as __SNOWPACK_ENV__ from './_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from './_snowpack/pkg/mithril.js';
import families from './src/theme/css-utils.css.js.js';

const utilToFamily = Object.entries(families).reduce((acc, [family, kids]) => {
    Object.keys(kids).forEach(util => acc[util] = family);
    return acc;
}, {});
const siblings = (util) => Object.keys(families[utilToFamily[util]]);

const next = (arr, item) => {
    const idx = arr.indexOf(item);
    if (idx === -1 || idx === arr.length - 1) return arr[0];
    return arr[idx + 1];
}

const prev = (arr, item) => {
    const idx = arr.indexOf(item);
    if (idx === -1 || idx === 0) return arr[arr.length - 1];
    return arr[idx - 1];
}

const utilsList = Object.entries(families).reduce((acc, [_, kids]) => {
    Object.entries(kids).forEach(([util, attrs]) => acc.push({ util, attrs: attrs.map(attr => attr.value).join('; ') }));
    return acc;
}, []);

const Zephyr = {
    selected: null,
    lastSelected: null,
    options: [],
    setSelected(option) {
        if (this.selected) this.lastSelected = this.selected;
        this.selected = option;
        const isSameFamily = this.lastSelected && utilToFamily[this.lastSelected.util] === utilToFamily[option.util];
        this.previewOption(option, this.lastSelected, isSameFamily);
        m.redraw();
    },
    getSelected() {
        if (!this.selected) return '';
        return this.selected.util;
    },
    cycle(isNext) {
        const fn = isNext ? next : prev;

        let nextOption;
        if (this.selected && this.options.includes(this.selected)) {
            const util = this.selected.util;
            const nextSib = fn(siblings(util), util);
            nextOption = utilsList.find(opt => opt.util == nextSib);
        } else if (this.options.length) {
            nextOption = this.options[0];
        } else {
            nextOption = utilsList[0];
        }

        this.setSelected(nextOption);
    },
    cycleNext() {
        this.cycle(true);
    },
    cyclePrev() {
        this.cycle(false);
    },
    getOptions(seed) {
        if (seed == '') {
            this.options = utilsList;
        } else {
            this.options = utilsList.filter(opt => opt.util.startsWith(seed));
        }
        // limit 50 options for speed in rendering
        return this.options.slice(0, 50);
    },
    oninit(vnode) {
        this.previewOption = vnode.attrs.previewOption;
    },
    view(vnode) {
        return m('ul.p1.m0.maxh64.w64.ovya.bg-black', this.getOptions(vnode.attrs.word).map(option =>
            m('li.df.jb', { class: this.selected === option ? 'bg-gray-eighty' : '' },
                m('div.pr2', option.util),
                m('div.tc-gray-forty', option.attrs)
            )
        ));
    }
};

export default Zephyr;

export const states = {
    default: {
        word: 'd',
        view(vnode) {
            const node = m(Zephyr, { word: this.word, previewOption: () => {} });
            return m('div',
                node,
                m('input', { type: 'text', value: this.word, oninput: e => this.word = e.target.value }),
                m('button', { onclick: () => node.state.cycleNext() }, 'Next'),
                m('button', { onclick: () => node.state.cyclePrev() }, 'Prev'),
            );
        }
    }
};
if (undefined /* [snowpack] import.meta.hot */ ) {
    undefined /* [snowpack] import.meta.hot */ .accept(({ module }) => {
        const reassign = (stale, fresh) => {
            Object.keys(stale).forEach(key => delete stale[key]);
            Object.assign(stale, fresh);
        }
        // for this to work effectively, m.js files should quietly export a list of their known components

        // updates will catch, but they won't rerun lifecycle methods
        reassign(Zephyr, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Zephyr).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}