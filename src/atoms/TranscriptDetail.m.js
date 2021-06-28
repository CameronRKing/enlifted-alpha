import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import EnliftedFilters from '../models/builtin/EnliftedFilters.ts.proxy.js'; 
import Popup from './Popup.m.js';
import Icon from './Icon.m.js';

const calcChunks = (str, highlights) => {
    const chunks = [];
    if (highlights.length === 0) return [{ tag: 'span', text: str }];

    let lastIdx = 0;
    highlights.forEach(highlight => {
        chunks.push({ text: str.slice(lastIdx, highlight.start), style: '' });
        chunks.push(highlight);
        lastIdx = highlight.end;
    });

    if (lastIdx !== str.length) {
        chunks.push({ text: str.slice(lastIdx) });
    }

    return chunks;
}

const TranscriptDetail = {
    highlights: [],
    chunks: [],
    modalContent: {},
    calcChunks,

    oninit(vnode) {
        this.sync(vnode, ["ctx", 'transcript']);
        this.highlights = EnliftedFilters.reduce((acc, filter) => {
            const matches = filter.match(this.transcript.currentDraft);
            
            // alias highlight color for easy reference in the view
            matches.forEach(match => {
                const { main, text } = match.filter.highlights;
                match.style = `bg-${main} tc-${text}`;
            });

            return acc.concat(matches);
        }, []);
        this.highlights.sort((l, r) => l.start - r.start);
        this.chunks = this.calcChunks(this.transcript.currentDraft, this.highlights);
    },

    maybePopInfo(chunk) {
        if (!chunk.filter) return;
        const filter = chunk.filter;
        this.modalContent = {
            title: filter.name,
            color: filter.highlights.main,
            content: filter.intro
        };
        this.infoModal.state.open(true);
    },

    closeInfo() {
        this.infoModal.state.open(false);
    },

    view: function TranscriptDetail(vnode) {
        this.sync(vnode, ["ctx", 'transcript']);
        return m("div", {
            "class": "header bold tc-white"
        }, [...(Array.isArray(this.chunks) ? this.chunks.map((chunk) => m("span", {
            "class": chunk.style,
            "onclick": () => this.maybePopInfo.bind(this)(chunk)
        }, [`${chunk.text}`])) : Object.entries(this.chunks).map(([_, chunk]) => m("span", {
            "class": chunk.style,
            "onclick": () => this.maybePopInfo.bind(this)(chunk)
        }, [`${chunk.text}`]))), (() => { this["infoModal"] = m(Popup, {
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
};

export default TranscriptDetail;

export const states = {
    base: {
        text: stream(`Don't do that, little Timmy! You might hurt yourself!`),
        view: function base(vnode) {
            this.sync(vnode, ["ctx"]);
            return m(TranscriptDetail, {
                ctx: this.ctx,
                "transcript": this.transcript
            });
        }
    }
};

export const tests = (o, mq) => {
    o('highlights negations', () => {
        const highlights = calcHighlights("dont can't notamatch WONT");
        o(highlights[0]).looseEquals({
            filterName: 'Negations',
            start: 0,
            end: 4,
            word: 'dont',
            text: 'dont'
        });
        o(highlights[1]).looseEquals({
            filterName: 'Negations',
            start: 5,
            end: 10,
            word: 'cant',
            text: "can't"
        });
        o(highlights[2]).looseEquals({
            filterName: 'Negations',
            start: 21,
            end: 25,
            word: 'wont',
            text: 'WONT'
        });

        o(highlights.length).equals(3);
    });
}
if (undefined /* [snowpack] import.meta.hot */ ) {
    undefined /* [snowpack] import.meta.hot */ .accept(({ module }) => {
        const reassign = (stale, fresh) => {
            Object.keys(stale).forEach(key => delete stale[key]);
            Object.assign(stale, fresh);
        }
        // for this to work effectively, m.js files should quietly export a list of their known components

        // updates will catch, but they won't rerun lifecycle methods
        reassign(TranscriptDetail, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === TranscriptDetail).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}