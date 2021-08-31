import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import Portal from '../atoms/Portal.m.js';
import Icon from '../atoms/Icon.m.js';
import AudioEntryDetail from '../molecules/AudioEntry/Detail/index.js';
import Home from './Home.m.js';

const EntryDetail = m.cmp({
    init: false,

    setup(vnode) {
        this.sync(vnode, ["ctx", 'entry']);
        this.ctx.bgColor('black');
        this.ctx.topNavVisible(true);
        this.ctx.bottomNavVisible(false);

        this.topLeftAction = {
            is: Icon,
            props: {
                is: 'arrow-left',
                color: 'white',
                onclick: () => {
                    this.ctx.analytics.emit('Return Home');
                    this.ctx.screenStack.pop();
                }
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
}, (cmp) => __cmps__['EntryDetail'] = cmp);

export default EntryDetail;

export let states = {
    base: { view: function (vnode) { return m(EntryDetail); } }
};

export let tests = (o, mq) => {
    o.spec('EntryDetail', () => {
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