import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import Icon from '../atoms/Icon.m.js';
import CreateEntry from '../molecules/AudioEntry/Create/index.js';
import EntryDetail from '../molecules/AudioEntry/Detail/index.js';
import Home from './Home.m.js';

const QuickEntry = {
    entry: null,
    setup(vnode) {
        this.sync(vnode, ["ctx"]);
        this.ctx.bgColor('black');
        this.ctx.bottomNavVisible(false);

        this.currView = stream('create');
        this.topLeftAction = {
            span: {
                props: {
                    class: 'sm-body bold tc-secondary-cool',
                    onclick: () => this.ctx.setView(Home)
                },
                content: 'Done'
            }
        };

        stream.lift(m.redraw, this.currView);
    },
    viewEntry(entry) {
        this.entry = entry;
        this.currView('detail');
    },
    view: function QuickEntry(vnode) {
        this.sync(vnode, ["ctx"]);
        return m("div", {
            "class": "wf hf"
        }, [this.currView() === 'create' ? m(CreateEntry, {
            ctx: this.ctx,
            "oncancel": () => this.ctx.setView(Home),
            "onfinish": this.viewEntry.bind(this),
            "prompt": m("div", {}, [`What's on your mind?`])
        }, []) : null, this.currView() === 'detail' ? m(EntryDetail, {
            ctx: this.ctx,
            "entry": this.entry,
            "topLeftAction": this.topLeftAction
        }) : null]);
    }
};

export default QuickEntry;

export const states = {
    base: { view: function (vnode) { return m(QuickEntry); } }
};

export const tests = (o, mq) => {
    o.spec('QuickEntry', () => {
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
        reassign(QuickEntry, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === QuickEntry).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}