import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';

// I can't get this thing to work properly
// the issue is mithril's render cycle. vnodes are missing data when they arrive here.
// like they haven't been rendered. Even after they've been rendered.
const knownPortals = {};
window.knownPortals = knownPortals;
const Portal = {
    updateForcer: {},
    watcher: null,

    onsync(vnode) {
        if (this.open === undefined) this.open = true;

        if (this.to && this.open) this.send(vnode.children[0]);
        if (this.to) console.log(this.to, this.open);
        if (this.to && this.open === false) {
            console.log('closing portal');
            this.send(undefined);
            m.redraw();
        }
        // you'd think this is required, but it's not, and it causes all sorts of trouble
        // if (!this.watcher && this.is) this.watcher = this.ensure(this.is).map(m.redraw)
    },

    ensure(name) {
        name = this.trueName(name);
        if (!knownPortals[name]) knownPortals[name] = stream();
        return knownPortals[name];
    },

    send(node) {
        this.ensure(this.to)(node);
    },

    onremove() {
        if (this.to) {
            const el = this.ensure(this.to)();

            console.log(el.state, el.state ? el.state.root : null);
            if (el.state) debugger;

            if (el && el.state && el.state.root) el.state.root.dom.remove();
            if (el && el.remove) el.remove();
            if (el && el.dom) el.dom.remove();
            this.send(undefined);
        }
        if (this.is) delete knownPortals[this.trueName(this.is)]; 
        m.redraw();
    },

    trueName(name) {
        return this.ctx && this.ctx.portalPrefix ? this.ctx.portalPrefix + name : name;
    },

    view: function Portal(vnode) {
        this.sync(vnode, ["ctx", 'to', 'is', 'open']);
        if (this.is && this.open) return this.ensure.bind(this)(this.is)();
    }
};

export default Portal;

export const states = {
    base: { view: function (vnode) { return m("div", {}, [m("h2", {}, [`To`]), m(Portal, {
        "to": "below"
    }, [m("p", {
        "class": "tc-white"
    }, [`I am text that has passed through the etheric realm.`])]), m("h2", {}, [`Is`]), m(Portal, {
        "is": "below"
    })]); } }
};

export const tests = (o, mq) => {
    o.spec('Portal', () => {
        o('Moves elements from :to to :is', () => {
            const cmp = mq({
                view: function (vnode) { return m("div", {}, [m("div", {
                    "id": "to"
                }, [m(Portal, {
                    "to": "below"
                }, [m("div", {
                    "id": "traveler"
                })])]), m("div", {
                    "id": "is"
                }, [m(Portal, {
                    "is": "below"
                })])]); }
            });

            cmp.should.not.have('#to #traveler');
            cmp.should.have('#is #traveler');
            o(true).equals(true);
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
        reassign(Portal, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Portal).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}