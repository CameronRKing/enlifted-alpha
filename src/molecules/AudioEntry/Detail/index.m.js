import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../../_snowpack/pkg/mithril.js';
import stream from '../../../../_snowpack/pkg/mithril/stream.js';
import Btn from '../../../atoms/Btn.m.js';
import Icon from '../../../atoms/Icon.m.js';
import TextInput from '../../../atoms/input/Text.m.js';
import Popup from '../../../atoms/Popup.m.js';
import TagList from '../../Tag/List.m.js';
import TranscriptDetail from '../../Transcript/Detail.m.js';
import AudioFilePlayer from '../../AudioFile/Player/index.js';
import SavedFilters from '../../../models/SavedFilters.js';
import AudioEntry from '../../../models/AudioEntry.js';

import TitleTagsEdit from './TitleTagsEdit.m.js';

const AudioEntryDetail = m.cmp({
    savedFilters: [],
    speechMetrics: {},
    currView: stream('main'),
    modalContent: {},

    async setup(vnode) {
        this.sync(vnode, ["ctx", 'entry', 'topLeftAction']);
        this.wordCountContent = { counts: {} };
        this.ctx.bgColor('black');
        this.ctx.topNavVisible(true);
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

        this.ctx.topNavConfig({
            left: this.topLeftAction,
            right: {
                is: 'span',
                props: {
                    class: "tc-secondary-cool bold sm-body",
                    onclick: () => {
                        this.ctx.analytics.emit('Title/Tags');
                        this.ctx.screenStack.add(TitleTagsEdit, 'up', { entry: this.entry });
                    }
                },
                // \u0026 = &
                content: `Name \u0026 Tag`
            }
        });
    },

    popInfo(title, color, content) {
        this.ctx.analytics.emit(`Tooltip ${title}`);
        this.modalContent = { title, color, content };
        this.infoModal.state.open(true);
    },

    popWordCount(filter) {
        if (this.infoModal.state.open()) return;

        this.ctx.analytics.emit(`${filter.name} Summary`);

        let { counts } = filter.match(this.entry.transcript.currentDraft);
        // capitalize the word
        counts = Object.entries(counts)
            .map(([key, val]) => [key[0].toUpperCase() + key.slice(1), val])
            .reduce((acc, [key, val]) => ({ ...acc, [key]: val }), {});

        this.wordCountContent = {
            title: filter.name,
            color: filter.highlights.main,
            counts
        };
        this.wordCountModal.state.open(true);
    },

    closeInfo() {
        this.infoModal.state.open(false);
    },

    viewTranscript() {
        this.ctx.analytics.emit('Transcript');
        const transcript = m.cmp({
            entry: this.entry,
            setup(vnode) {
                this.sync(vnode, ["ctx"]);
                this.ctx.bgColor('black');
                this.ctx.topNavVisible(true);
                this.ctx.topNavConfig({
                    left: {
                        is: Icon,
                        props: {
                            is: 'arrow-left',
                            color: 'white',
                            onclick: () => this.ctx.screenStack.pop()
                        }
                    }
                });
            },
            view: function transcript(vnode) {
                this.sync(vnode, ["ctx"]);
                return m("div", {}, [m(TranscriptDetail, {
                    ctx: this.ctx,
                    ctx: this.ctx,
                    "transcript": this.entry.transcript
                }), m(AudioFilePlayer, {
                    ctx: this.ctx,
                    ctx: this.ctx,
                    "audioFile": stream(this.entry.audio)
                })]);
            },
        }, (cmp) => __cmps__['transcript'] = cmp);
        this.ctx.screenStack.add(transcript, 'left');
    },

    view: function AudioEntryDetail(vnode) {
        this.sync(vnode, ["ctx", 'entry', 'topLeftAction']);
        return m("div", {}, [m("div", {
            "class": "sm-body tc-gray-forty"
        }, [`${this.entry.timestamps.formatCreatedAt()}`]), m("div", {
            "class": "lg-body bold tc-white pb1"
        }, [`${this.entry.title}`]), m(TagList, {
            ctx: this.ctx,
            "tags": this.entry.tags,
            "color": "white"
        }), m("div", {
            "class": "df jc"
        }, [m(Btn, {
            ctx: this.ctx,
            "class": "mt5 h12 br2 lg-body bold italic notransform",
            "color": "secondary-cool",
            "onclick": this.viewTranscript.bind(this)
        }, [`Listen `, m.trust("&amp;&nbsp;"), `Review My Language
                `])]), m("div", {
            "class": "pt6 lg-body"
        }, [m("div", {
            "class": "bold italic tc-gray-forty"
        }, [`My Language`]), ...(Array.isArray(this.savedFilters) ? this.savedFilters.map((filter) => m("div", {
            "class": "df jb aic py3",
            "onclick": () => this.popWordCount.bind(this)(filter)
        }, [m("div", {
            "class": "tc-white"
        }, [`${filter.name}`]), m("div", {
            "class": "df aic"
        }, [m("span", {
            "class": 'pr3 bold tc-' + filter.highlights.main
        }, [`${filter.match(this.entry.transcript.currentDraft).matches.length}`]), m(Icon, {
            ctx: this.ctx,
            "is": "info",
            "color": "white",
            "onclick": () => this.popInfo.bind(this)(filter.name, filter.highlights.main, filter.intro)
        })])])) : Object.entries(this.savedFilters).map(([_, filter]) => m("div", {
            "class": "df jb aic py3",
            "onclick": () => this.popWordCount.bind(this)(filter)
        }, [m("div", {
            "class": "tc-white"
        }, [`${filter.name}`]), m("div", {
            "class": "df aic"
        }, [m("span", {
            "class": 'pr3 bold tc-' + filter.highlights.main
        }, [`${filter.match(this.entry.transcript.currentDraft).matches.length}`]), m(Icon, {
            ctx: this.ctx,
            "is": "info",
            "color": "white",
            "onclick": () => this.popInfo.bind(this)(filter.name, filter.highlights.main, filter.intro)
        })])]))), (() => { this["wordCountModal"] = m(Popup, {
            ctx: this.ctx,
            "withExit": false,

            "body": m("div", {}, [m("div", {
                "class": 'header italic bold center pb2 tc-' + this.wordCountContent.color
            }, [`${this.wordCountContent.title}`]), ...(Array.isArray(this.wordCountContent.counts) ? this.wordCountContent.counts.map((count, word) => m("div", {
                "class": "p4 lg-body tc-white df jb"
            }, [m("span", {}, [`${word}`]), m("span", {}, [`${count}`])])) : Object.entries(this.wordCountContent.counts).map(([word, count]) => m("div", {
                "class": "p4 lg-body tc-white df jb"
            }, [m("span", {}, [`${word}`]), m("span", {}, [`${count}`])])))]),

            "footer": m("div", {
                "class": "df jc pt2 pb6"
            }, [m(Icon, {
                ctx: this.ctx,
                "is": "cross",
                "onclick": () => this.wordCountModal.state.open(false)
            })])
        }, []); return this["wordCountModal"]; })()]), m("div", {
            "class": "pt6 lg-body"
        }, [m("div", {
            "class": "bold italic tc-gray-forty"
        }, [`My Speech`]), ...(Array.isArray(this.speechMetrics) ? this.speechMetrics.map((val, name) => m("div", {
            "class": "df jb aic py3",
            "onclick": () => this.ctx.analytics.emit(name)
        }, [m("div", {
            "class": "tc-white"
        }, [`${name}`]), m("div", {
            "class": "df aic"
        }, [m("span", {
            "class": "pr3 bold tc-white"
        }, [`${val}`]), m(Icon, {
            ctx: this.ctx,
            "is": "info",
            "color": "white",
            "onclick": () => this.ctx.analytics.emit('Tooltip ' + name)
        })])])) : Object.entries(this.speechMetrics).map(([name, val]) => m("div", {
            "class": "df jb aic py3",
            "onclick": () => this.ctx.analytics.emit(name)
        }, [m("div", {
            "class": "tc-white"
        }, [`${name}`]), m("div", {
            "class": "df aic"
        }, [m("span", {
            "class": "pr3 bold tc-white"
        }, [`${val}`]), m(Icon, {
            ctx: this.ctx,
            "is": "info",
            "color": "white",
            "onclick": () => this.ctx.analytics.emit('Tooltip ' + name)
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
        }, []); return this["infoModal"]; })()]);
    }
}, (cmp) => __cmps__['AudioEntryDetail'] = cmp);

export default AudioEntryDetail;


import { fakes } from '../../../models/AudioEntry.js';
export let states = {
    base: m.cmp({ entry: fakes.lorem, view: function base(vnode) {
        this.sync(vnode, ["ctx"]);
        return m(AudioEntryDetail, {
            ctx: this.ctx,
            "entry": this.entry
        });
    } }, (cmp) => __cmps__['base'] = cmp)
};

export let tests = (o, mq) => {
    o.spec('AudioEntryDetail', () => {
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