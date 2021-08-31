import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import Icon from '../atoms/Icon.m.js';
import CreateEntry from '../molecules/AudioEntry/Create/index.js';
import EntryDetail from '../molecules/AudioEntry/Detail/index.js';
import Home from './Home.m.js';

const QuickEntry = m.cmp({
    entry: null,
    setup(vnode) {
        this.sync(vnode, ["ctx"]);
        this.ctx.bgColor('black');
        this.ctx.bottomNavVisible(false);
    },
    viewEntry(entry) {
        this.ctx.screenStack.swap(EntryDetail, 'right', {
            entry,
            topLeftAction: {
                is: 'span',
                content: 'Done',
                props: {
                    class: 'sm-body bold tc-secondary-cool',
                    onclick: () => {
                        this.ctx.analytics.emit('Done');
                        this.ctx.screenStack.pop();
                    }
                },
            }
        });
    },
    view: function QuickEntry(vnode) {
        this.sync(vnode, ["ctx"]);
        return m("div", {
            "class": "wf hf"
        }, [m(CreateEntry, {
            ctx: this.ctx,
            "oncancel": () => this.ctx.screenStack.pop(),
            "onfinish": this.viewEntry.bind(this),
            "prompt": m("div", {}, [`What's on your mind?`])
        }, [])]);
    }
}, (cmp) => __cmps__['QuickEntry'] = cmp);

export default QuickEntry;

export let states = {
    base: { view: function (vnode) { return m(QuickEntry); } }
};

export let tests = (o, mq) => {
    o.spec('QuickEntry', () => {
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