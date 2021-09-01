import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import routes from '../../boot/routes.js';
import TopNav from './Top.m.js';
import BottomNav from './Bottom.m.js';
import ScreenStack from './ScreenStack.m.js';
// import TranscribeService from '@/services/Transcribe.ts';
import BrowserTranscribe from '../../services/BrowserTranscribe.js';
import MixpanelAnalytics from '../../services/MixpanelAnalytics.js';
import MockAnalytics from '../../services/MockAnalytics.js';
// import Kaldi from '@/services/kaldi/main.js';
import Model from '../../db/Model.js';

const analytics = (__SNOWPACK_ENV__ && __SNOWPACK_ENV__.MODE === 'production' ? MixpanelAnalytics : MockAnalytics);

const AppShell = m.cmp({
    viewProps: {},

    setup(vnode) {
        this.sync(vnode, ["ctx", 'cmp']);
        this.localCtx = {
            // probably should have named this better
            audioInput: BrowserTranscribe,
            analytics,
            screenStack: null, // set in oncreate

            // shell styling
            topNavVisible: stream(true),
            topNavConfig: stream({}),
            bottomNavVisible: stream(true),
            bottomNavBgColor: stream('black'),
            bgColor: stream('transparent'),
            
            // routing
            currView: stream(null),
            setView: (cmp, props={}) => {
                this.localCtx.currView(cmp);
                this.viewProps = props;
                m.redraw();
            },

            // view data that persists across navigation
            session: {
                Home: stream({
                    activeFilters: stream([])
                }),
            },
        };

        this.ready = stream(false);
        Model.ready().then(() => this.ready(true));

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

    oncreate(vnode) {
        this.localCtx.screenStack = this.screenStack.state;
        this.localCtx.screenStack.ready.then(() => this.ready(true));
        if (this.cmp) this.localCtx.screenStack.ready.then(() => this.localCtx.screenStack.add(this.cmp, 'up'));
    },

    view: function AppShell(vnode) {
        this.sync(vnode, ["ctx", 'cmp']);
        return m("div", {
            "class": this.innerStyle.bind(this)()
        }, [(() => { this["screenStack"] = m(ScreenStack, {
            ctx: this.ctx,
            "ctx": this.localCtx
        }); return this["screenStack"]; })()]);
    }
}, (cmp) => __cmps__['AppShell'] = cmp);

export default AppShell;

export let states = {
    base: { view: function (vnode) { return m(AppShell); } }
};

export let tests = (o, mq) => {
    o.spec('AppShell', () => {
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
