import * as __SNOWPACK_ENV__ from './_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from './_snowpack/pkg/mithril.js';
import stream from './_snowpack/pkg/mithril/stream.js';

const TraceTimeline = {
    searchTerm: '',
    selectedRow: null,
    rows: [],
    findRowNode(row) {
        return this.rows.find(([rrow, node]) => rrow === row)[1].dom;
    },
    oninit(vnode) {
        if (!window.sodb_log) window.sodb_log = stream([]);
        if (!window.sodb_selected) window.sodb_selected = stream(null);
        this.selected = window.sodb_selected.map(row => {
            this.selectedRow = row;
            m.redraw();
            if (!row) return;
            this.findRowNode(this.selectedRow).scrollIntoViewIfNeeded();
        });
        this.log = window.sodb_log;
        this.redraw = this.log.map(log => m.redraw());
    },
    view(vnode) {
        this.rows = this.log().filter(row => row.loc.includes(this.searchTerm)).map(row => 
                [row, m('.pl2', { class: this.selectedRow === row ? 'bg-gray-eighty' : '' },
                    m('.italic.pt2', row.loc.split('/').slice(-1)),
                    m('pre.m0.pb2', row.val)
                )]
            );

        return m('div', 
            m('input', { value: this.searchTerm, oninput: (e) => this.searchTerm = e.target.value }),
            this.rows.map(([_, vnode]) => vnode),
        );
    }
};

export default TraceTimeline;

export const states = {};
if (undefined /* [snowpack] import.meta.hot */ ) {
    undefined /* [snowpack] import.meta.hot */ .accept(({ module }) => {
        const reassign = (stale, fresh) => {
            Object.keys(stale).forEach(key => delete stale[key]);
            Object.assign(stale, fresh);
        }
        // for this to work effectively, m.js files should quietly export a list of their known components

        // updates will catch, but they won't rerun lifecycle methods
        reassign(TraceTimeline, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === TraceTimeline).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}