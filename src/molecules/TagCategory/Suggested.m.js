import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import Pill from '../../atoms/Pill.m.js';
import Tag from '../../models/Tag.js';
import top100EnglishWords from './top100EnglishWords.js';

const SuggestedTags = m.cmp({
    suggested: stream([]),

    async setup(vnode) {
        this.sync(vnode, ["ctx", 'transcript', 'tags']);
        this.addedTags = [];
        // suggest top 3 words as tags
        this.baseCorpus =  Object.entries(this.transcript.wordFreqDict())
            .sort((l, r) => r[1] - l[1])
            .map(([word, freq]) => word)
            .filter(word => !top100EnglishWords.includes(word));

        // the suggested list is the top 3 highest frequency words that aren't already tags
        this.suggested = stream([]);

        this.tags.map(async tags => {
            // when tags we know to have been added have since been removed,
            // fire an analytics event
            this.addedTags.slice().forEach(tag => {
                if (!tags.includes(tag)) {
                    this.ctx.analytics.emit('Suggested Tag Remove', { tag: tag.name });
                    this.addedTags.remove(tag);
                }
            })

            const tagNames = tags.toArray().map(tag => tag.name);
            const fried = await Promise.all(
                this.baseCorpus
                    .filter(word => !tagNames.includes(word))
                    .slice(0, 3)
                    .map(word => Tag.fry(word))
            );
            this.suggested(fried);
        });

        stream.lift(m.redraw, this.suggested);
    },

    toggleTag(tag) {
        // though it says "toggle", once suggested tags are added to an entry, they disappear from suggested,
        // so they must be be de-toggled elsewhere
        this.ctx.analytics.emit('Suggested Tag Add');
        this.addedTags.push(tag);
        this.tags(this.tags().toggle(tag));
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
        }, []), ...(Array.isArray(this.suggested()) ? this.suggested().map((tag) => m(Pill, {
            ctx: this.ctx,
            "onclick": () => this.toggleTag.bind(this)(tag),
            "style": "m1"
        }, [`+ ${tag.name}`])) : Object.entries(this.suggested()).map(([_, tag]) => m(Pill, {
            ctx: this.ctx,
            "onclick": () => this.toggleTag.bind(this)(tag),
            "style": "m1"
        }, [`+ ${tag.name}`])))]);
    }
}, (cmp) => __cmps__['SuggestedTags'] = cmp);

export default SuggestedTags;

export let states = {
    base: { view: function (vnode) { return m(SuggestedTags); } }
};

export let tests = (o, mq) => {
    o.spec('SuggestedTags', () => {
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