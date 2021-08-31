import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import Btn from '../Btn.m.js';
import SecondaryBtn from '../SecondaryBtn.m.js';
import Icon from '../Icon.m.js';

const baseStyle = 'wf h12 p3 bg-gray-eighty brss br2 brw2 sm-body animate__animated';
const stateColors = {
    unfocused: 'gray-eighty',
    focused: 'secondary-cool',
    error: 'primary-warm'
};
const borderStyle = (state) => 'br-' + stateColors[state];

const TextInput = m.cmp({
    setup(vnode) {
        this.sync(vnode, [
            "ctx",
            'val',
            'valid',
            'withClearBtn',
            'style',
            'placeholder',
            'placeholderIcon',
            'onclear',
            'onfocus'
        ]);

        this.innerVal = stream();
        this.val.map(this.innerVal);
        this.state = stream('unfocused');
        this.isValid = stream(true);
        this.isValid.map(isValid => {
            switch (this.state()) {
                case 'unfocused':
                    break;
                case 'focused':
                case 'error':
                    this.state(isValid ? 'focused' : 'error');
            }
        });
        // for controlling animations as part of form submission flow
        this.shaking = stream(false);


        stream.lift(m.redraw, this.state, this.val, this.shaking);
    },

    oncreate(vnode) {
        if (this.placeholderIcon) {
            Icon.getSrc(this.placeholderIcon).then(str => {
                vnode.dom.style.setProperty('--placeholder-icon', 'url("data:image/svg+xml,' + encodeURIComponent(str) + '")');
            });
        }
    },

    onsync() {
        if (this.withClearBtn === undefined) this.withClearBtn = false;
    },

    innerStyle() {
        const extraPadding = this.placeholderIcon ? 'pl12' : '';
        const animation = this.shaking() ? 'animate__shakeX' : '';
        return `${baseStyle} ${borderStyle(this.state())} ${this.style || ''} ${extraPadding} ${animation}`;
    },

    doubleCheckValidity() {
        this.validate(this.innerVal());
        return this.isValid();
    },

    validate(val) {
        // if no validator, simply pass through
        if (!this.valid) {
            this.val(val);
            return;
        }

        // otherwise set isValid to the result of the user's function
        this.isValid(this.valid(val));

        // if it's valid, pass through
        if (this.isValid() === true) {
            this.val(val);
        } else {
            // otherwise, keep internally for the user to continue editing
            this.innerVal(val);
        }
    },

    setState() {
        this.state(this.isValid() ? 'focused' : 'error');
    },

    shake() {
        this.shaking(true);
        setTimeout(() => this.shaking(false), 2000);
    },

    view: function TextInput(vnode) {
        this.sync(vnode, [
            "ctx",
            'val',
            'valid',
            'withClearBtn',
            'style',
            'placeholder',
            'placeholderIcon',
            'onclear',
            'onfocus'
        ]);

        return m("div", {}, [m("label", {}, [m("input", {
            "type": "text",
            "class": this.innerStyle.bind(this)(),
            "value": this.innerVal(),
            "placeholder": this.placeholder,
            "onfocus": this.onfocus,
            "oninput": e => this.validate.bind(this)(e.target.value),
            "onclick": this.setState.bind(this),
            "onblur": () => this.state('unfocused')
        })]), this.withClearBtn || this.valid ? m("div", {
            "class": "df jb p1"
        }, [
            m("div", {}, [vnode.attrs.feedback]),
            m("div", {}, [this.withClearBtn ? m(SecondaryBtn, {
                ctx: this.ctx,
                "onclick": () => { if (this.onclear) this.onclear(); this.val('') }
            }, [`Clear`]) : null])
        ]) : null]);
    }
}, (cmp) => __cmps__['TextInput'] = cmp);

export default TextInput;

export let states = {
    base: { view: function (vnode) { return m(TextInput); } }
};

export let tests = (o, mq) => {
    o.spec('TextInput', () => {
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