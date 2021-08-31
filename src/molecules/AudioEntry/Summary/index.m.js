import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../../_snowpack/pkg/mithril.js';
import stream from '../../../../_snowpack/pkg/mithril/stream.js';
import TagList from '../../Tag/List.m.js';

const AudioEntrySummary = m.cmp({
    view: function AudioEntrySummary(vnode) {
        this.sync(vnode, ["ctx", 'entry']);
        return m("div", {
            "class": "p4 my1 bg-white br2",
            ...vnode.attrs
        }, [m("div", {
            "class": "tc-gray-sixty sm-body"
        }, [`${this.entry.timestamps.formatCreatedAt()}`]), m("div", {
            "class": "bold lg-body tc-black truncate pb1"
        }, [`${this.entry.title}`]), m(TagList, {
            ctx: this.ctx,
            "tags": this.entry.tags,
            "nowrap": true,
            "color": "black"
        })]);
    }
}, (cmp) => __cmps__['AudioEntrySummary'] = cmp);

export default AudioEntrySummary;

import { fakes } from '../../../models/AudioEntry.js';
export let states = {
    base: m.cmp({ entry: fakes.lorem, view: function base(vnode) {
        this.sync(vnode, ["ctx"]);
        return m(AudioEntrySummary, {
            ctx: this.ctx,
            "entry": this.entry
        });
    } }, (cmp) => __cmps__['base'] = cmp)
};

export let tests = (o, mq) => {
    o.spec('AudioEntrySummary', () => {
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