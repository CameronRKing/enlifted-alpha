import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../../_snowpack/pkg/mithril.js';
import stream from '../../../../_snowpack/pkg/mithril/stream.js';
import Btn from '../../../atoms/Btn.m.js';
import Icon from '../../../atoms/Icon.m.js';
import TagDisplay from '../../../atoms/TagDisplay.m.js';
import TranscriptDetail from '../../../atoms/TranscriptDetail.m.js';
import TextInput from '../../../atoms/input/Text.m.js';
import Popup from '../../../atoms/Popup.m.js';
import AudioFilePlayer from '../../AudioFile/Player/index.js';
import SavedFilters from '../../../models/SavedFilters.ts.proxy.js';
import AudioEntry from '../../../models/AudioEntry.ts.proxy.js';

import TitleTagsEdit from './TitleTagsEdit.m.js';

const AudioEntryDetail = {
    savedFilters: [],
    speechMetrics: {},
    currView: stream('main'),
    modalContent: {},

    async setup(vnode) {
        this.sync(vnode, ["ctx", 'entry', 'topLeftAction']);
        this.title = this.$wrap(this.entry, 'title');
        this.savedFilters = await SavedFilters.singleton();
        this.speechMetrics = {
            'Words Per Minute': this.entry.audio.wpm,
            'Avg. Volume': this.entry.audio.avgVol + 'db',
            'Max Volume': this.entry.audio.peakVol + 'db'
        };

        // if the icon is the same, mithril reuses click handlers in a strange way
        // the simple around it is to hard reset over a render cycle
        const setNav = (config => {
            this.ctx.topNavConfig({});
            setTimeout(() => this.ctx.topNavConfig(config), 16);
        });
        this.currView.map(view => {
            switch (view) {
                case 'main':
                    setNav({
                        left: this.topLeftAction,
                        right: {
                            span: {
                                props: {
                                    class: "tc-secondary-cool bold sm-body",
                                    onclick: () => this.currView('title/tags'),
                                },
                                // \u0026 = &
                                content: `Name \u0026 Tag`
                            }
                        }
                    })
                    break;
                case 'transcript':
                    setNav({
                        left: {
                            icon: {
                                is: 'arrow-left',
                                color: 'white',
                                onclick: () => this.currView('main')
                            }
                        }
                    });
                    break;
            }
        });
    },

    popInfo(title, color, content) {
        this.modalContent = { title, color, content };
        this.infoModal.state.open(true);
    },

    closeInfo() {
        this.infoModal.state.open(false);
    },

    view: function AudioEntryDetail(vnode) {
        this.sync(vnode, ["ctx", 'entry', 'topLeftAction']);
        return m("div", {}, [this.currView() === 'main' ? m("div", {}, [m("div", {
            "class": "sm-body tc-gray-forty"
        }, [`${this.entry.timestamps.formatCreatedAt()}`]), m("div", {
            "class": "lg-body bold tc-white pb1"
        }, [`${this.entry.title}`]), m(TagDisplay, {
            ctx: this.ctx,
            "tags": this.entry.tags,
            "color": "white"
        }), m("div", {
            "class": "df jc"
        }, [m(Btn, {
            ctx: this.ctx,
            "class": "mt5 h12 br2 lg-body bold italic notransform",
            "color": "secondary-cool",
            "onclick": () => this.currView('transcript')
        }, [`Listen `, m.trust("&amp;&nbsp;"), `Review My Language
                    `])]), m("div", {
            "class": "pt6 lg-body"
        }, [m("div", {
            "class": "bold italic tc-gray-forty"
        }, [`My Language`]), ...(Array.isArray(this.savedFilters) ? this.savedFilters.map((filter) => m("div", {
            "class": "df jb aic py3"
        }, [m("div", {
            "class": "tc-white"
        }, [`${filter.name}`]), m("div", {
            "class": "df aic"
        }, [m("span", {
            "class": 'pr3 bold tc-' + filter.highlights.main
        }, [`${filter.match(this.entry.transcript.currentDraft).length}`]), m(Icon, {
            ctx: this.ctx,
            "is": "info",
            "color": "white",
            "onclick": () => this.popInfo.bind(this)(filter.name, filter.highlights.main, filter.intro)
        })])])) : Object.entries(this.savedFilters).map(([_, filter]) => m("div", {
            "class": "df jb aic py3"
        }, [m("div", {
            "class": "tc-white"
        }, [`${filter.name}`]), m("div", {
            "class": "df aic"
        }, [m("span", {
            "class": 'pr3 bold tc-' + filter.highlights.main
        }, [`${filter.match(this.entry.transcript.currentDraft).length}`]), m(Icon, {
            ctx: this.ctx,
            "is": "info",
            "color": "white",
            "onclick": () => this.popInfo.bind(this)(filter.name, filter.highlights.main, filter.intro)
        })])])))]), m("div", {
            "class": "pt6 lg-body"
        }, [m("div", {
            "class": "bold italic tc-gray-forty"
        }, [`My Speech`]), ...(Array.isArray(this.speechMetrics) ? this.speechMetrics.map((val, name) => m("div", {
            "class": "df jb aic py3"
        }, [m("div", {
            "class": "tc-white"
        }, [`${name}`]), m("div", {
            "class": "df aic"
        }, [m("span", {
            "class": "pr3 bold tc-white"
        }, [`${val}`]), m(Icon, {
            ctx: this.ctx,
            "is": "info",
            "color": "white"
        })])])) : Object.entries(this.speechMetrics).map(([name, val]) => m("div", {
            "class": "df jb aic py3"
        }, [m("div", {
            "class": "tc-white"
        }, [`${name}`]), m("div", {
            "class": "df aic"
        }, [m("span", {
            "class": "pr3 bold tc-white"
        }, [`${val}`]), m(Icon, {
            ctx: this.ctx,
            "is": "info",
            "color": "white"
        })])])))]), (() => { this["infoModal"] = m(Popup, {
            ctx: this.ctx,
            "withExit": false,

            "body": m("div", {}, [m("div", {
                "class": 'df jc pt5 pb7 header bold italic tc-' + this.modalContent.color
            }, [`${this.modalContent.title}`]), m("div", {
                "class": "lg-body tc-white"
            }, [`${this.modalContent.content}`])]),

            "footer": m("div", {
                "class": "df jc pt8 pb5"
            }, [m(Icon, {
                ctx: this.ctx,
                "is": "cross",
                "onclick": this.closeInfo.bind(this)
            })])
        }, []); return this["infoModal"]; })()]) : null, this.currView() === 'transcript' ? m("div", {}, [m(TranscriptDetail, {
            ctx: this.ctx,
            "transcript": this.entry.transcript
        }), m(AudioFilePlayer, {
            ctx: this.ctx,
            "audioFile": stream(this.entry.audio)
        })]) : null, this.currView() === 'title/tags' ? m(TitleTagsEdit, {
            ctx: this.ctx,
            "entry": this.entry,
            "currView": this.currView
        }) : null]);
    }
};

export default AudioEntryDetail;


import { fakes } from '../../../models/AudioEntry.ts.proxy.js';
export const states = {
    base: { entry: fakes.lorem, view: function base(vnode) {
        this.sync(vnode, ["ctx"]);
        return m(AudioEntryDetail, {
            ctx: this.ctx,
            "entry": this.entry
        });
    } }
};

export const tests = (o, mq) => {
    o.spec('AudioEntryDetail', () => {
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