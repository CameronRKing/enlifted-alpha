import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import TextInput from '../../atoms/input/Text.m.js';
import SecondaryBtn from '../../atoms/SecondaryBtn.m.js';
import Pill from '../../atoms/Pill.m.js';
import Popup from '../../atoms/Popup.m.js';
import Tag from '../../models/Tag.js';
import TagCreate from '../Tag/Create.m.js';

/*

    todo: Tag names aren't allowed to include emojis.
    can look for them in regex like /\p{Extended_Pictographic}/u
        - needed: validation flow. are they allowed to be typed, or do we auto-remove?
        - how/where do we indicate to the user that emojis aren't allowed?
*/


const tagSelectedStyle = 'tc-white bg-secondary-cool'

const TagCategorySelect = m.cmp({
    visible: [],
    availableTags: [],

    async setup(vnode) {
        this.sync(vnode, ["ctx", 'category', 'tags']);
        this.search = stream('');
        this.availableTags = await this.category.tags();

        // tags in the set that have been added to this category but not yet saved
        this.newTags = this.tags.map(tags => {
            return tags.toArray()
                .filter(tag => tag.category === this.category && !tag._id);
        });

        stream.lift((search, newTags) => {
            const regex = new RegExp(search, 'i');
            const matches = (tag) => tag.name.match(regex);
            // new (unsaved) tags are displayed at the front of the list
            const visibleNew = newTags.filter(matches);
            const visibleAvailable = this.availableTags.filter(matches);
            this.visible = [...visibleNew, ...visibleAvailable];
        }, this.search, this.newTags);

        // a little indirect: TagCreate emits the new tag name through the passed-in stream for flexibility
        this.newTagName = stream();
        this.newTagName.map(async name => {
            const newTag = await Tag.fry(name);
            const tags = this.tags();
            tags.toggle(newTag);
            this.tags(tags);

            if (name === this.search()) {
                this.ctx.analytics.emit('Tag Search Create Tag');
                this.search('');
            }
        });

        this.initialNewTagName = this.search;

        m.redraw();
    },

    newTag() {
        this.newTagPopup.state.open(true);
    },

    tagStyle(tag) {
        const style = this.tags().has(tag) ? tagSelectedStyle : '';
        return style;
    },

    view: function TagCategorySelect(vnode) {
        this.sync(vnode, ["ctx", 'category', 'tags']);
        return m("div", {
            "class": "pt8"
        }, [m("div", {
            "class": "lg-body bold tc-gray-twenty"
        }, [`${this.category.title}`]), m("div", {
            "class": "mt2 mb4 df jb aic"
        }, [m("div", {
            "class": "fg1 pr3"
        }, [m(TextInput, {
            ctx: this.ctx,
            "val": this.search,
            "placeholder": "Search",
            "placeholderIcon": "search",
            "onfocus": () => this.ctx.analytics.emit('Tag Search'),
            "withClearBtn": true
        })]), this.newTagName ? m(TagCreate, {
            ctx: this.ctx,
            "style": "hf pb8",
            "name": this.newTagName,
            "initial": this.initialNewTagName
        }) : null]), m("div", {
            "class": "dfw js ais"
        }, [...(Array.isArray(this.visible) ? this.visible.map((tag) => m(Pill, {
            ctx: this.ctx,
            "style": this.tagStyle.bind(this)(tag),
            "onclick": () => { this.ctx.analytics.emit('Tag ' + (this.tags().has(tag) ? 'Remove' : 'Add'), { tag: tag.name }); this.tags(this.tags().toggle(tag)) }
        }, [`${tag.name}`])) : Object.entries(this.visible).map(([_, tag]) => m(Pill, {
            ctx: this.ctx,
            "style": this.tagStyle.bind(this)(tag),
            "onclick": () => { this.ctx.analytics.emit('Tag ' + (this.tags().has(tag) ? 'Remove' : 'Add'), { tag: tag.name }); this.tags(this.tags().toggle(tag)) }
        }, [`${tag.name}`])))])]);
    }
}, (cmp) => __cmps__['TagCategorySelect'] = cmp);

export default TagCategorySelect;

export let states = {
    base: { view: function (vnode) { return m(TagCategorySelect); } }
};

export let tests = (o, mq) => {
    o.spec('TagCategorySelect', () => {
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