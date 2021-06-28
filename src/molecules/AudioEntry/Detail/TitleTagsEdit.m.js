import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../../_snowpack/pkg/mithril.js';
import stream from '../../../../_snowpack/pkg/mithril/stream.js';
import Icon from '../../../atoms/Icon.m.js';
import TextInput from '../../../atoms/input/Text.m.js';
import SuggestedTags from '../../TagCategory/Suggested.m.js';
import TagCategorySelect from '../../TagCategory/Select.m.js';
import AudioEntry from '../../../models/AudioEntry.ts.proxy.js';
import TagCategory from '../../../models/TagCategory.ts.proxy.js';
import TagSet from './TagSet.js';

const TitleTagsEdit = {
    initialData: {},
    title: stream(''),

    setup(vnode) {
        this.sync(vnode, ["ctx", 'currView', 'entry']);
        this.ctx.topNavConfig({
            left: {
                icon: {
                    is: 'cross',
                    color: 'white',
                    onclick: () => this.exitTitleTags()
                }
            },
            right: {
                icon: {
                    is: 'tick',
                    color: 'success',
                    onclick: () => this.saveTitleTags()
                }
            }
        });

        this.initial = {
            title: this.entry.title,
            tags: new TagSet(this.entry.tags)
        };
        this.title = this.$wrap(this.entry, 'title');
        this.tags = stream(new TagSet(this.entry.tags));
        this.tags.map(tags => {
            this.entry.tags = tags.toArray();
        });

        stream.lift(m.redraw, this.tags);
    },

    exitTitleTags() {
        this.title(this.initial.title);
        this.tags(this.initial.tags);
        this.currView('main');
    },

    async saveTitleTags() {
        if (!this.titleInput.state.doubleCheckValidity()) {
            this.titleInput.state.shake();
            return;
        }

        await this.entry.save();
        this.currView('main');
    },

    view: function TitleTagsEdit(vnode) {
        this.sync(vnode, ["ctx", 'currView', 'entry']);
        return m("div", {}, [(() => { this["titleInput"] = m(TextInput, {
            ctx: this.ctx,
            "val": this.title,
            "valid": str => 1 <= str.length && str.length <= AudioEntry.TITLE_MAX_LENGTH,
            "withClearBtn": true,

            "feedback": m("span", {}, [
                `Char: ${this.titleInput ? AudioEntry.TITLE_MAX_LENGTH - this.titleInput.state.innerVal().length : 0}`
            ])
        }, []); return this["titleInput"]; })(), m(SuggestedTags, {
            ctx: this.ctx,
            "transcript": this.entry.transcript,
            "tags": this.tags
        }), m(TagCategorySelect, {
            ctx: this.ctx,
            "category": TagCategory.None,
            "tags": this.tags
        })]);
    }
};

export default TitleTagsEdit;

export const states = {
    base: { view: function (vnode) { return m(TitleTagsEdit); } }
};

export const tests = (o, mq) => {
    o.spec('TitleTagsEdit', () => {
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
        reassign(TitleTagsEdit, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === TitleTagsEdit).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}