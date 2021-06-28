import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import Icon from '../../atoms/Icon.m.js';
import MicBtn from '../../atoms/MicBtn.m.js';
import LiveAudioVisualization from '../../molecules/AudioFile/LiveVisualization.m.js'
import { colors } from '../../theme/css-utils.css.js.js';
import AudioConfig from '../../models/builtin/AudioConfig.ts.proxy.js';
import OnboardingModel from '../../models/Onboarding.ts.proxy.js';
import Home from '../Home.m.js';

const Onboarding = {
    prompt: 'I think this practice can help me improve',
    setup(vnode) {
        this.sync(vnode, ["ctx"]);
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
                setTimeout(() => {
                    this.ctx.setView(Home, { withAnnotation: true, animation: 'fadeInUp'});
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
            // requestPermissions promise will reject if user says no
            await this.ctx.audioInput.requestPermissions();
            this.currView('input');
            setTimeout(() => this.ctx.audioInput.startRecord({ filename: 'calibrate.wav' }), 100);

            this.setupAudioInput();

        } catch (e) {} // if user says no, leave them where they are
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
            if (text == this.prompt.toLowerCase()) {
                input.stopRecord();
                input.restart();
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
            "class": "center lg-body tc-white px4 pb8"
        }, [
            `All voice transcription happens in-browser, so nobody--not a mega-corporation, not even us--can see your data. Our secure voice transcription engine takes a few seconds to load.`
        ]), m("div", {
            "class": "center pb6 px6 sm-body tc-white"
        }, [`tap to calibrate when the green bar disappears...`]), m(MicBtn, {
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
};

export default Onboarding;

export const states = {
    base: { view: function base(vnode) {
        this.sync(vnode, ["ctx"]);
        return m(Onboarding, {
            ctx: this.ctx
        });
    } }
};

export const tests = (o, mq) => {
    o.spec('Onboarding', () => {
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
        reassign(index, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === index).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}