import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import Icon from './Icon.m.js';

const Popup = m.cmp({
    setup(vnode) {
        this.sync(vnode, ["ctx", 'withExit', 'pos', 'selfClosed']);
        this.wasOpen = false;
        this.animating = stream(false);
        this.open = stream(false);
        this.open.map(isOpen => {
            if (isOpen) {
                this.wasOpen = true;
                this.animating(true);
                setTimeout(() => {
                    this.scrim.dom.classList.toggle('bg-blur');
                }, 16);
                setTimeout(() => this.animating(false), 400);
            } else {
                if (!this.wasOpen) return;
                this.wasOpen = false;
                this.animating(true);
                if (this.scrim && this.scrim.dom) this.scrim.dom.classList.toggle('bg-blur');
                setTimeout(() => this.animating(false), 400);
            }
        });
        stream.lift(m.redraw, this.open, this.animating);
    },

    onsync() {
        if (this.pos === undefined) this.pos = 'center';
        if (this.withExit === undefined) this.withExit = true;
        if (this.selfClosed === undefined) this.selfClosed = stream();
    },

    innerStyle() {
        const adjustment = {
            center: 'b0 t0',
            bottom: 'b0',
            top: 't0'
        }[this.pos];


        return `animate__animated animate__slide${this.open() ? 'InUp' : 'OutDown'} wf hfc bg-black br2 ma p4 pf l0 r0 ${adjustment}`;
    },

    view: function Popup(vnode) {
        this.sync(vnode, ["ctx", 'withExit', 'pos', 'selfClosed']);
        return (() => { this["scrim"] = this.open() || !this.open() && this.animating() ? m("div", {
            "class": "wf hf pa ma t0 l0 df jc aic",
            "style": "z-index: 9998; transition: backdrop-filter 0.4s, background 0.4s;"
        }, [m("div", {
            "class": this.innerStyle.bind(this)()
        }, [m("div", {
            "class": "df jb aic"
        }, [this.withExit ? m("div", {}, [m(Icon, {
            ctx: this.ctx,
            "is": "cross",
            "onclick": () => { this.open(false); this.selfClosed(true); }
        })]) : null, m("div", {
            "class": "sm-body bold tc-white"
        }, [vnode.attrs.header]), m("div", {}, [vnode.attrs.topRight])]), vnode.attrs.body, vnode.attrs.footer])]) : null; return this["scrim"]; })();
    }
}, (cmp) => __cmps__['Popup'] = cmp);

export default Popup;

export let states = {
    base: { view: function (vnode) { return m(Popup); } }
};

export let tests = (o, mq) => {
    o.spec('Popup', () => {
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