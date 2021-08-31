import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import SecondaryBtn from '../../atoms/SecondaryBtn.m.js';
import Popup from '../../atoms/Popup.m.js';
import TextInput from '../../atoms/input/Text.m.js';
import Tag from '../../models/Tag.js';

const TagCreate = m.cmp({
    setup(vnode) {
        this.sync(vnode, ["ctx", 'name', 'initial', 'style']);
        if (this.initial === undefined) this.initial = stream();
        this.newTagName = stream('');
        this.popupSelfClosed = stream();
        this.popupSelfClosed.map(() => this.ctx.analytics.emit('Tag Create Cancel'));
        this.initial.map(this.newTagName);
    },

    newTag() {
        this.ctx.analytics.emit('Tag Create');
        this.namePopup.state.open(true);
    },

    save() {
        this.ctx.analytics.emit('Tag Create Save');

        if (!this.newTagInput.state.doubleCheckValidity()) {
            this.newTagInput.state.shake();
            return;
        }

        // alert parent of new name through passed-in stream
        this.name(this.newTagName());

        this.namePopup.state.open(false);
    },

    view: function TagCreate(vnode) {
        this.sync(vnode, ["ctx", 'name', 'initial', 'style']);
        return m("span", {
            "class": this.style
        }, [m(SecondaryBtn, {
            ctx: this.ctx,
            "style": "bold",
            "onclick": this.newTag.bind(this)
        }, [`+ New Tag`]), (() => { this["namePopup"] = m(Popup, {
            ctx: this.ctx,
            "selfClosed": this.popupSelfClosed,

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
                "onclear": () => this.ctx.analytics.emit('Tag Create Clear'),

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
}, (cmp) => __cmps__['TagCreate'] = cmp);

export default TagCreate;

export let states = {
    base: { view: function (vnode) { return m(TagCreate); } }
};

export let tests = (o, mq) => {
    o.spec('TagCreate', () => {
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