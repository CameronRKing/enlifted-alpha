import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../../_snowpack/pkg/mithril.js';
import stream from '../../../../_snowpack/pkg/mithril/stream.js';
import Icon from '../../../atoms/Icon.m.js';
import TextInput from '../../../atoms/input/Text.m.js';
import SuggestedTags from '../../TagCategory/Suggested.m.js';
import TagCategorySelect from '../../TagCategory/Select.m.js';
import AudioEntry from '../../../models/AudioEntry.js';
import TagCategory, { NoneReady } from '../../../models/TagCategory.js';
import TagSet from './TagSet.js';

const TitleTagsEdit = m.cmp({
    initialData: {},
    title: stream(''),

    setup(vnode) {
        this.sync(vnode, ["ctx", 'entry']);
        this.ctx.topNavConfig({
            left: {
                is: Icon,
                props: {
                    is: 'cross',
                    color: 'white',
                    onclick: () => this.exitTitleTags()
                }
            },
            right: {
                is: Icon,
                props: {
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
            this.entry.tags.splice(0, this.entry.tags.length, ...tags.toArray());
        });

        stream.lift(m.redraw, this.tags);
    },

    exitTitleTags() {
        this.ctx.analytics.emit('Exit');
        this.title(this.initial.title);
        this.tags(this.initial.tags);
        this.ctx.screenStack.pop();
    },

    async saveTitleTags() {
        this.ctx.analytics.emit('Done');

        if (!this.titleInput.state.doubleCheckValidity()) {
            this.titleInput.state.shake();
            return;
        }

        await this.entry.save();
        this.ctx.screenStack.pop();
    },

    view: function TitleTagsEdit(vnode) {
        this.sync(vnode, ["ctx", 'entry']);
        return m("div", {}, [(() => { this["titleInput"] = m(TextInput, {
            ctx: this.ctx,
            "val": this.title,
            "valid": str => 1 <= str.length && str.length <= AudioEntry.TITLE_MAX_LENGTH,
            "withClearBtn": true,
            "onclear": () => this.ctx.analytics.emit('Clear Title'),

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
}, (cmp) => __cmps__['TitleTagsEdit'] = cmp);

export default TitleTagsEdit;

export let states = {
    base: { view: function (vnode) { return m(TitleTagsEdit); } }
};

export let tests = (o, mq) => {
    o.spec('TitleTagsEdit', () => {
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