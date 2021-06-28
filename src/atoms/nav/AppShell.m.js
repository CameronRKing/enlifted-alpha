import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import routes from '../../boot/routes.js';
import TopNav from './Top.m.js';
import BottomNav from './Bottom.m.js';
import TranscribeService from '../../services/Transcribe.ts.proxy.js';
import Kaldi from '../../services/Kaldi/main.js';
import Model from '../../db/Model.ts.proxy.js';

const AppShell = {
    viewProps: {},

    setup(vnode) {
        this.sync(vnode, ["ctx", 'cmp']);
        this.localCtx = {
            topNavVisible: stream(true),
            topNavConfig: stream({}),
            bottomNavVisible: stream(true),
            bottomNavBgColor: stream('black'),
            bgColor: stream('transparent'),
            
            currView: stream(null),
            setView: (cmp, props={}) => {
                this.localCtx.currView(cmp);
                this.viewProps = props;
                m.redraw();
            },

            // a place for storing view data that persists across navigation
            session: {
                Home: stream({}),
            },

            audioInput: Kaldi
        };

        if (this.cmp) this.localCtx.setView(this.cmp, {});

        this.ready = stream(false);
        Model.__db.ready().then(() => this.ready(true));

        stream.lift(m.redraw,
            this.ready,
            this.localCtx.topNavVisible,
            this.localCtx.topNavConfig,
            this.localCtx.bottomNavVisible,
            this.localCtx.bottomNavBgColor,
            this.localCtx.bgColor
        );
    },

    innerStyle() {
        return `dfc wf hf bg-${this.localCtx.bgColor()}`;
    },

    view: function AppShell(vnode) {
        this.sync(vnode, ["ctx", 'cmp']);
        return m("div", {
            "class": this.innerStyle.bind(this)()
        }, [m("div", {
            "class": "p5 fg1 ovya"
        }, [this.localCtx.topNavVisible() ? m(TopNav, {
            ctx: this.ctx,
            "config": this.localCtx.topNavConfig(),
            "ctx": this.localCtx
        }) : null, this.ready() ? m(this.localCtx.currView(), {
            ctx: this.ctx,
            ...this.viewProps,
            "ctx": this.localCtx
        }) : null]), this.localCtx.bottomNavVisible() ? m(BottomNav, {
            ctx: this.ctx,
            "ctx": this.localCtx,
            "bgColor": this.localCtx.bottomNavBgColor()
        }) : null]);
    }
};

export default AppShell;

export const states = {
    base: { view: function (vnode) { return m(AppShell); } }
};

export const tests = (o, mq) => {
    o.spec('AppShell', () => {
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
        reassign(AppShell, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === AppShell).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}