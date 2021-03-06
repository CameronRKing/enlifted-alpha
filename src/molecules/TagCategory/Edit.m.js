import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import Btn from '../../atoms/Btn.m.js';
import Icon from '../../atoms/Icon.m.js';
import Popup from '../../atoms/Popup.m.js';
import TextInput from '../../atoms/input/Text.m.js';
import TagCreate from '../Tag/Create.m.js';
import Tag from '../../models/Tag.ts.proxy.js';

const TagCategorySelect = {
    tags: [],
    entryCounts: {},
    currTag: null,

    setup(vnode) {
        this.sync(vnode, ["ctx", 'category']);
        const [tags, entryCounts] = this.category.tagsWithEntryCount();
        this.tags = tags;
        this.entryCounts = entryCounts;
        this.currTagName = stream('');
        this.newTagName = stream();
        this.newTagName.map(async name => {
            const newTag = await Tag.bake(name);
            this.tags.push(newTag);
            this.entryCounts[newTag.name] = 0;
            this.tags.sort((l, r) => l.name.localeCompare(r.name));
        })
    },

    edit(tag) {
        this.currTag = tag;
        this.currTagName(tag.name);
        this.editPopup.state.open(true);
    },

    promptDelete() {
        this.editPopup.state.open(false);
        this.deletePopup.state.open(true);
    },

    cancel() {
        this.deletePopup.state.open(false);
        this.editPopup.state.open(true);
    },

    deleteTag() {
        delete this.entryCounts[this.currTag.name];
        this.tags.remove(this.currTag);
        this.currTag.delete();
        this.deletePopup.state.open(false);
    },

    async save() {
        if (!this.nameInput.state.doubleCheckValidity()) {
            this.nameInput.state.shake();
            return;
        }

        const oldName = this.currTag.name;
        this.currTag.name = this.currTagName();
        await this.currTag.save();
        this.entryCounts[this.currTag.name] = this.entryCounts[oldName];
        delete this.entryCounts[oldName];
        this.editPopup.state.open(false);
    },

    view: function TagCategorySelect(vnode) {
        this.sync(vnode, ["ctx", 'category']);
        return m("div", {}, [...(Array.isArray(this.tags) ? this.tags.map((tag) => m("div", {
            "class": "df jb py3"
        }, [m("div", {
            "class": "sm-body tc-white"
        }, [`${tag.name}`]), m("div", {
            "class": "df aic"
        }, [m("span", {
            "class": "sm-body tc-gray-forty mr2"
        }, [`${this.entryCounts[tag.name]}`]), m(Icon, {
            ctx: this.ctx,
            "is": "edit",
            "color": "white",
            "onclick": () => this.edit.bind(this)(tag)
        })])])) : Object.entries(this.tags).map(([_, tag]) => m("div", {
            "class": "df jb py3"
        }, [m("div", {
            "class": "sm-body tc-white"
        }, [`${tag.name}`]), m("div", {
            "class": "df aic"
        }, [m("span", {
            "class": "sm-body tc-gray-forty mr2"
        }, [`${this.entryCounts[tag.name]}`]), m(Icon, {
            ctx: this.ctx,
            "is": "edit",
            "color": "white",
            "onclick": () => this.edit.bind(this)(tag)
        })])]))), m("div", {
            "class": "pt3"
        }, [m(TagCreate, {
            ctx: this.ctx,
            "name": this.newTagName
        })]), (() => { this["editPopup"] = m(Popup, {
            ctx: this.ctx,
            "pos": "center",

            "header": m("div", {
                "class": "header body-font tc-white df jc"
            }, [`Edit Tag`]),

            "topRight": m(Icon, {
                ctx: this.ctx,
                "is": "trash",
                "color": "primary-warm",
                "onclick": this.promptDelete.bind(this)
            }),

            "body": m("div", {
                "class": "mt8 mb4"
            }, [(() => { this["nameInput"] = m(TextInput, {
                ctx: this.ctx,
                "val": this.currTagName,
                "valid": str => 1 <= str.length && str.length <= Tag.NAME_MAX_LENGTH,
                "withClearBtn": true,

                "feedback": m("span", {}, [
                    `Char: ${(this.nameInput && this.nameInput.state) ? Tag.NAME_MAX_LENGTH - this.nameInput.state.innerVal().length : 0}`
                ])
            }, []); return this["nameInput"]; })()]),

            "footer": m(Btn, {
                ctx: this.ctx,
                "color": "secondary-cool",
                "fill": "solid",
                "class": "h12 wf br2 mb6 lg-body bold italic capitalize",
                "onclick": this.save.bind(this)
            }, [`Save`])
        }, []); return this["editPopup"]; })(), (() => { this["deletePopup"] = m(Popup, {
            ctx: this.ctx,
            "pos": "center",

            "header": m("div", {
                "class": "header body-font tc-white df jc"
            }, [`Delete Tag?`]),

            "body": m("div", {
                "class": "my8 df"
            }, [m(Btn, {
                ctx: this.ctx,
                "class": "fg1 lg-body bold h12 br2 italic capitalize",
                "color": "secondary-cool",
                "fill": "solid",
                "onclick": this.cancel.bind(this)
            }, [`Keep`]), m("div", {
                "class": "w4"
            }), m(Btn, {
                ctx: this.ctx,
                "class": "fg1 lg-body bold h12 br2 italic capitalize",
                "color": "primary-warm",
                "fill": "solid",
                "onclick": this.deleteTag.bind(this)
            }, [`Delete`])]),

            "footer": m("div", {
                "class": "mb6 sm-body tc-gray-forty df jc"
            }, [`Your entries will remain intact.`])
        }, []); return this["deletePopup"]; })()]);
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
        reassign(Edit, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Edit).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}