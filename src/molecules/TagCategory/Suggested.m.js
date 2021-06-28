import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import Pill from '../../atoms/Pill.m.js';
import Tag from '../../models/Tag.ts.proxy.js';
import top100EnglishWords from './top100EnglishWords.js';

const SuggestedTags = {
    suggested: stream([]),

    async setup(vnode) {
        this.sync(vnode, ["ctx", 'transcript', 'tags']);
        // suggest top 3 words as tags
        this.baseCorpus =  Object.entries(this.transcript.wordFreqDict())
            .sort((l, r) => r[1] - l[1])
            .map(([word, freq]) => word)
            .filter(word => !top100EnglishWords.includes(word));

        // the suggested list is the top 3 highest frequency words that aren't already tags
        this.suggested = this.tags.map(tags => {
            const tagNames = tags.toArray().map(tag => tag.name);
            return this.baseCorpus
                .filter(word => !tagNames.includes(word))
                .slice(0, 3)
                .map(word => Tag.fry(word))
        });

        stream.lift(m.redraw, this.suggested);
    },

    view: function SuggestedTags(vnode) {
        this.sync(vnode, ["ctx", 'transcript', 'tags']);
        return m("div", {
            "class": "pt6"
        }, [m("div", {
            "class": "lg-body bold tc-gray-twenty"
        }, [`Suggested Tags`]), m("div", {
            "class": "sm-body tc-gray-forty mb2"
        }, [`You said these words a lot.`]), m("div", {
            "class": "df js"
        }, [...(Array.isArray(this.suggested()) ? this.suggested().map((tag) => m(Pill, {
            ctx: this.ctx,
            "onclick": () => this.tags(this.tags().toggle(tag)),
            "style": "m1"
        }, [`+ ${tag.name}`])) : Object.entries(this.suggested()).map(([_, tag]) => m(Pill, {
            ctx: this.ctx,
            "onclick": () => this.tags(this.tags().toggle(tag)),
            "style": "m1"
        }, [`+ ${tag.name}`])))])]);
    }
};

export default SuggestedTags;

export const states = {
    base: { view: function (vnode) { return m(SuggestedTags); } }
};

export const tests = (o, mq) => {
    o.spec('SuggestedTags', () => {
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
        reassign(Suggested, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Suggested).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}