import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import Icon from '../../atoms/Icon.m.js';
import MicBtn from '../../atoms/MicBtn.m.js';
import LiveAudioVisualization from '../../molecules/AudioFile/LiveVisualization.m.js'
import { colors } from '../../theme/css-utils.css.js.js';
import AudioConfig from '../../models/builtin/AudioConfig.js';
import OnboardingModel from '../../models/Onboarding.js';
import Home from '../Home.m.js';
import { save as saveTags } from '../../models/builtin/DefaultTags.js';

const Onboarding = m.cmp({
    prompt: 'I think this practice can help me improve',
    setup(vnode) {
        this.sync(vnode, ["ctx"]);
        // populate data in the app database only once, when onboarding loads
        saveTags();

        this.ctx.topNavConfig({});
        this.ctx.bottomNavVisible(false);
        this.ctx.bgColor('black');

        this.currView = stream('intro');
        this.miscalibrated = stream(false);
        this.translated = stream(false);
        this.peaks = [];
        this.listeners = [];

        this.translated.map(translated => {
            if (translated) {
                this.ctx.analytics.emit('Select soft talk');
                setTimeout(() => {
                    this.ctx.screenStack.swap(Home, 'up', { withAnnotation: true });
                }, 4000);
            }
        });

        stream.lift(m.redraw, this.currView, this.miscalibrated);
    },
    toCalibrate() {
        this.ctx.topNavConfig({
            center: {
                is: Icon,
                props: {
                    is: 'logo',
                    color: colors.radical
                }
            }
        });
        this.currView('calibrate');  
    },
    async toInput() {
        try {
            this.ctx.analytics.emit('Record');
            // requestPermissions promise will reject if user says no
            await this.ctx.audioInput.requestPermissions();
            this.ctx.analytics.emit('Enable mic access');
            this.currView('input');
            setTimeout(() => this.ctx.audioInput.startRecord({ filename: 'calibrate.wav' }), 100);

            this.setupAudioInput();

        } catch (e) {
            this.ctx.analytics.emit('Reject mic access');
        } // if user says no, leave them where they are
    },
    setupAudioInput() {
        const input = this.ctx.audioInput;
        let ll;
        ll = input.addListener('meter', ({ avgDb }) => {
            this.peaks.push(AudioConfig.deviceDbToActual(avgDb));
            m.redraw();
        });
        this.listeners.push(ll);

        ll = input.addListener('results', ({ text }) => {
            if (text.toLowerCase() == this.prompt.toLowerCase()) {
                input.stopRecord();
                input.restart();
                this.ctx.analytics.emit('Calibration success');
                this.miscalibrated(false);
                this.currView('translate');
                this.clearListeners();
                
                OnboardingModel.singleton().then(status => {
                    status.initial = true;
                    status.save();
                });
            } else if (!this.prompt.toLowerCase().startsWith(text)) { // if text doesnt match the prompt, recalibrate
                input.stopRecord();
                input.restart();
                this.ctx.analytics.emit('Try again');
                this.miscalibrated(true);
                this.currView('calibrate');
                this.clearListeners();
            }
        });
        this.listeners.push(ll);
    },
    clearListeners() {
        this.listeners.forEach(ll => ll.remove());
        this.listeners = [];
    },
    view: function Onboarding(vnode) {
        this.sync(vnode, ["ctx"]);
        return m("div", {
            "class": "wf hf"
        }, [this.currView() === 'intro' ? m("div", {
            "onclick": this.toCalibrate.bind(this)
        }, [m("div", {
            "class": "pa ma l0 r0 t50 df jc animate__animated animate__fadeInUp"
        }, [m(Icon, {
            ctx: this.ctx,
            "is": "logo-big",
            "color": colors.radical
        })]), m("div", {
            "class": "pa ma t0 b0 l0 r0 wf df jc aic lg-body tc-white"
        }, [`Welcome to Enlifted.`])]) : null, this.currView() === 'calibrate' ? m("div", {}, [m("div", {
            "class": "pa ma t0 b0 l0 r0 dfc jc aic"
        }, [this.miscalibrated() ? m("div", {
            "class": "pb17 center header body-font bold italic tc-white"
        }, [`Could you try that again please?
                    `]) : null, m("div", {
            "class": "center pb6 px6 sm-body tc-white"
        }, [`tap to calibrate...`]), m(MicBtn, {
            ctx: this.ctx,
            "onclick": this.toInput.bind(this)
        }), m("div", {
            "class": "w50p"
        })])]) : null, this.currView() === 'input' ? m("div", {}, [m("div", {
            "class": "center pt4 pb3 header body-font bold italic tc-primary-medium"
        }, [`Say the phrase:`]), m("div", {
            "class": "center header body-font bold italic tc-white"
        }, [`"${this.prompt}"`]), m(LiveAudioVisualization, {
            ctx: this.ctx,
            "peaks": this.peaks
        })]) : null, this.currView() === 'translate' ? m("div", {}, [m("div", {
            "class": "pa ma t0 b0 l0 r0 df aic"
        }, [m("div", {
            "class": "center header body-font bold italic tc-white px4"
        }, [!this.translated() ? m("span", {}, [`"`, m("span", {
            "class": "soft-talk-pulse",
            "onclick": () => this.translated(true)
        }, [`I think`]), m.trust("&nbsp;"), `this practice can help me improve"
                        `]) : null, this.translated() ? m("span", {}, [`"This practice can help me improve"
                        `]) : null])])]) : null]);
    }
}, (cmp) => __cmps__['Onboarding'] = cmp);

export default Onboarding;

export let states = {
    base: m.cmp({ view: function base(vnode) {
        this.sync(vnode, ["ctx"]);
        return m(Onboarding, {
            ctx: this.ctx
        });
    } }, (cmp) => __cmps__['base'] = cmp)
};

export let tests = (o, mq) => {
    o.spec('Onboarding', () => {
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