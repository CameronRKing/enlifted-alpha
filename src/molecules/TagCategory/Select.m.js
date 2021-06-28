import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import TextInput from '../../atoms/input/Text.m.js';
import SecondaryBtn from '../../atoms/SecondaryBtn.m.js';
import Pill from '../../atoms/Pill.m.js';
import Popup from '../../atoms/Popup.m.js';
import Tag from '../../models/Tag.ts.proxy.js';
import TagCreate from '../Tag/Create.m.js';

/*

    todo: Tag names aren't allowed to include emojis.
    can look for them in regex like /\p{Extended_Pictographic}/u
        - needed: validation flow. are they allowed to be typed, or do we auto-remove?
        - how/where do we indicate to the user that emojis aren't allowed?
*/


const tagSelectedStyle = 'tc-white bg-secondary-cool'

const TagCategorySelect = {
    visible: [],
    availableTags: [],

    setup(vnode) {
        this.sync(vnode, ["ctx", 'category', 'tags']);
        this.search = stream('');
        this.availableTags = this.category.tags();

        // tags in the set that have been added to this category but not yet saved
        this.newTags = this.tags.map(tags => {
            return tags.toArray()
                .filter(tag => tag.category === this.category && !tag._id);
        });

        stream.lift((search, newTags) => {
            // new (unsaved) tags are displayed at the front of the list
            const visibleNew = newTags.filter(tag => tag.name.match(search));
            const visibleAvailable = this.availableTags.filter(tag => tag.name.match(search));
            this.visible = [...visibleNew, ...visibleAvailable];
        }, this.search, this.newTags);

        // a little indirect: TagCreate emits the new tag name through the passed-in stream for flexibility
        this.newTagName = stream();
        this.newTagName.map(name => {
            const newTag = Tag.fry(name);
            const tags = this.tags();
            tags.toggle(newTag);
            this.tags(tags);
        });
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
            "placeholderIcon": "search"
        })]), m(TagCreate, {
            ctx: this.ctx,
            "name": this.newTagName
        })]), m("div", {
            "class": "dfw js ais"
        }, [...(Array.isArray(this.visible) ? this.visible.map((tag) => m(Pill, {
            ctx: this.ctx,
            "style": this.tagStyle.bind(this)(tag),
            "onclick": () => this.tags(this.tags().toggle(tag))
        }, [`${tag.name}`])) : Object.entries(this.visible).map(([_, tag]) => m(Pill, {
            ctx: this.ctx,
            "style": this.tagStyle.bind(this)(tag),
            "onclick": () => this.tags(this.tags().toggle(tag))
        }, [`${tag.name}`])))])]);
    }
};

export default TagCategorySelect;

export const states = {
    base: { view: function (vnode) { return m(TagCategorySelect); } }
};

export const tests = (o, mq) => {
    o.spec('TagCategorySelect', () => {
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
        reassign(Select, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Select).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}