import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import SecondaryBtn from '../../atoms/SecondaryBtn.m.js';
import Popup from '../../atoms/Popup.m.js';
import TextInput from '../../atoms/input/Text.m.js';
import Tag from '../../models/Tag.ts.proxy.js';

const TagCreate = {
    setup(vnode) {
        this.sync(vnode, ["ctx", 'name']);
        this.newTagName = stream('');
    },

    newTag() {
        this.namePopup.state.open(true);
    },

    save() {
        if (!this.newTagInput.state.doubleCheckValidity()) {
            this.newTagInput.state.shake();
            return;
        }

        // alert parent of new name through passed-in stream
        this.name(this.newTagName());

        this.namePopup.state.open(false);
    },

    view: function TagCreate(vnode) {
        this.sync(vnode, ["ctx", 'name']);
        return m("span", {}, [m(SecondaryBtn, {
            ctx: this.ctx,
            "style": "bold",
            "onclick": this.newTag.bind(this)
        }, [`+ New Tag`]), (() => { this["namePopup"] = m(Popup, {
            ctx: this.ctx,

            "body": m("div", {
                "class": "pb6"
            }, [m("div", {
                "class": "header bold tc-white df jc"
            }, [`New Tag`]), (() => { this["newTagInput"] = m(TextInput, {
                ctx: this.ctx,
                "val": this.newTagName,
                "valid": str => 1 <= str.length && str.length <= Tag.NAME_MAX_LENGTH,
                "withClearBtn": true,
                "style": "my3",

                "feedback": m("span", {}, [
                    `Char: ${(this.newTagInput && this.newTagInput.state) ? Tag.NAME_MAX_LENGTH - this.newTagInput.state.innerVal().length : 0}`
                ])
            }, []); return this["newTagInput"]; })()]),

            "footer": m("div", {
                "class": "df jc"
            }, [m(SecondaryBtn, {
                ctx: this.ctx,
                "style": "lg-body italic",
                "onclick": this.save.bind(this)
            }, [`Save`])])
        }, []); return this["namePopup"]; })()]);
    }
};

export default TagCreate;

export const states = {
    base: { view: function (vnode) { return m(TagCreate); } }
};

export const tests = (o, mq) => {
    o.spec('TagCreate', () => {
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
        reassign(Create, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Create).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}