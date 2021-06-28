import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import Portal from '../atoms/Portal.m.js';
import Icon from '../atoms/Icon.m.js';
import AudioEntryDetail from '../molecules/AudioEntry/Detail/index.js';
import Home from './Home.m.js';

const EntryDetail = {
    init: false,

    setup(vnode) {
        this.sync(vnode, ["ctx", 'entry']);
        this.ctx.bgColor('black');
        this.ctx.topNavVisible(true);
        this.ctx.bottomNavVisible(false);

        this.topLeftAction = {
            icon: {
                is: 'arrow-left',
                color: 'white',
                onclick: () => this.ctx.setView(Home)
            }
        };
    },

    view: function EntryDetail(vnode) {
        this.sync(vnode, ["ctx", 'entry']);
        return m(AudioEntryDetail, {
            ctx: this.ctx,
            "entry": this.entry,
            "topLeftAction": this.topLeftAction
        });
    }
};

export default EntryDetail;

export const states = {
    base: { view: function (vnode) { return m(EntryDetail); } }
};

export const tests = (o, mq) => {
    o.spec('EntryDetail', () => {
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
        reassign(EntryDetail, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === EntryDetail).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}