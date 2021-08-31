import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';

import firebase from '../boot/firebase.js';

const db = firebase.firestore();
window.fs = db;

// now what do I need to do?
// design the FirebaseModel class + API; replace references to 'extends Model' with 'extends FirebaseModel'
// re-implement queries

const FirebaseExplorer = m.cmp({

    view: function FirebaseExplorer(vnode) {
        this.sync(vnode, ["ctx"]);
        return m("div");
    }
}, (cmp) => __cmps__['FirebaseExplorer'] = cmp);

export default FirebaseExplorer;

export let states = {
    base: { view: function (vnode) { return m(FirebaseExplorer); } }
};

export let tests = (o, mq) => {
    o.spec('FirebaseExplorer', () => {
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