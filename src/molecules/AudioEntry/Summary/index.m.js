import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../../_snowpack/pkg/mithril.js';
import stream from '../../../../_snowpack/pkg/mithril/stream.js';
import TagDisplay from '../../../atoms/TagDisplay.m.js';

const AudioEntrySummary = {
    view: function AudioEntrySummary(vnode) {
        this.sync(vnode, ["ctx", 'entry']);
        return m("div", {
            "class": "p4 my1 bg-white br2",
            ...vnode.attrs
        }, [m("div", {
            "class": "tc-gray-sixty sm-body"
        }, [`${this.entry.timestamps.formatCreatedAt()}`]), m("div", {
            "class": "bold lg-body tc-black truncate pb1"
        }, [`${this.entry.title}`]), m(TagDisplay, {
            ctx: this.ctx,
            "tags": this.entry.tags,
            "nowrap": true,
            "color": "black"
        })]);
    }
};

export default AudioEntrySummary;

import { fakes } from '../../../models/AudioEntry.ts.proxy.js';
export const states = {
    base: { entry: fakes.lorem, view: function base(vnode) {
        this.sync(vnode, ["ctx"]);
        return m(AudioEntrySummary, {
            ctx: this.ctx,
            "entry": this.entry
        });
    } }
};

export const tests = (o, mq) => {
    o.spec('AudioEntrySummary', () => {
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
        reassign(index, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === index).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}