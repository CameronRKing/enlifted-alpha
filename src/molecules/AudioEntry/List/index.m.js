import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../../../_snowpack/pkg/mithril.js';
import stream from '../../../../_snowpack/pkg/mithril/stream.js';
import Popup from '../../../atoms/Popup.m.js';
import Pill from '../../../atoms/Pill.m.js';
import Btn from '../../../atoms/Btn.m.js';
import Icon from '../../../atoms/Icon.m.js';
import EntrySummary from '../Summary/index.js';
import AudioEntry from '../../../models/AudioEntry.ts.proxy.js';
import TagCategory from '../../../models/TagCategory.ts.proxy.js';

// this should really be abstracted into a component
const tagSelectedStyle = 'tc-white bg-secondary-cool';

const AudioEntryList = {
    visible: stream([]),
    available: stream([]),
    entryCount: 0,
    selectedTags: stream([]),

    setup(vnode) {
        this.sync(vnode, ["ctx", 'onselect', 'activeFilters']);
        this.available(AudioEntry.all());
        this.visible(this.available());
        this.entryCount = this.available().length;
        this.allTags = TagCategory.None.tags().sort((l, r) => l.name.localeCompare(r.name));

        this.activeFilters.map(tags => {
            // currently doing the filter in-memory
            // selecting multiple tags is an AND operation
            this.visible(this.available().filter(entry =>
                tags.reduce((acc, tag) => acc && entry.tags.some(tt => tt.name == tag.name), true)    
            ));
        });

        stream.lift(m.redraw, this.visible);
    },

    popFilters() {
        // reset filter state if out of sync
        if (this.activeFilters() !== this.selectedTags()) {
            this.selectedTags(this.activeFilters().slice());
        }

        this.filterPopup.state.open(true);
    },

    tagStyle(tag) {
        return this.selectedTags().includes(tag) ? tagSelectedStyle : '';
    },

    toggleFilter(tag) {
        const tags = this.selectedTags();
        // Array.remove is defined in @/boot/utils.js

        tags.includes(tag) ? tags.remove(tag) : tags.push(tag);

        this.selectedTags(tags);
    },

    runFilter() {
        this.activeFilters(this.selectedTags().slice());
        this.filterPopup.state.open(false);
    },

    view: function AudioEntryList(vnode) {
        this.sync(vnode, ["ctx", 'onselect', 'activeFilters']);
        return m("div", {
            "class": "dfc js"
        }, [m("div", {
            "class": "df jb aic"
        }, [m("div", {
            "class": "header body-font thin"
        }, [`Entries (${this.entryCount})`]), m("div", {
            "class": "sm-body bold",
            "onclick": this.popFilters.bind(this)
        }, [`${this.activeFilters().length ? 'Change Filters' : 'Filter'}`])]), this.activeFilters().length ? m("div", {
            "class": "pr h12"
        }, [this.activeFilters().length ? m("div", {
            "style": "width: calc(100% - 20px)",
            "class": "pf pr8 pb1 nowrap ovxa noscrollbar"
        }, [
            ...(Array.isArray(this.activeFilters()) ? this.activeFilters().map((tag) => m(Pill, {
                ctx: this.ctx,
                "style": "sm-body tc-white bg-secondary-cool dfi jb aic ml0 mr2"
            }, [m(Icon, {
                ctx: this.ctx,
                "is": "cross",
                "onclick": () => { this.toggleFilter.bind(this)(tag); this.runFilter.bind(this)(); }
            }), `${tag.name}
                        `])) : Object.entries(this.activeFilters()).map(([_, tag]) => m(Pill, {
                ctx: this.ctx,
                "style": "sm-body tc-white bg-secondary-cool dfi jb aic ml0 mr2"
            }, [m(Icon, {
                ctx: this.ctx,
                "is": "cross",
                "onclick": () => { this.toggleFilter.bind(this)(tag); this.runFilter.bind(this)(); }
            }), `${tag.name}
                        `])))
        ]) : null]) : null, ...(Array.isArray(this.visible()) ? this.visible().map((entry) => m(EntrySummary, {
            ctx: this.ctx,
            "entry": entry,
            "onclick": () => this.onselect(entry)
        })) : Object.entries(this.visible()).map(([_, entry]) => m(EntrySummary, {
            ctx: this.ctx,
            "entry": entry,
            "onclick": () => this.onselect(entry)
        }))), (() => { this["filterPopup"] = m(Popup, {
            ctx: this.ctx,
            "pos": "bottom",
            "header": m("span", {}, [`Select Filters`]),

            "body": m("div", {
                "class": "mt6 mb10"
            }, [m("div", {
                "class": "lg-body bold tc-white"
            }, [`Tags`]), m("div", {
                "class": "dfw"
            }, [...(Array.isArray(this.allTags) ? this.allTags.map((tag) => m(Pill, {
                ctx: this.ctx,
                "style": this.tagStyle.bind(this)(tag),
                "onclick": () => this.toggleFilter.bind(this)(tag)
            }, [`${tag.name}`])) : Object.entries(this.allTags).map(([_, tag]) => m(Pill, {
                ctx: this.ctx,
                "style": this.tagStyle.bind(this)(tag),
                "onclick": () => this.toggleFilter.bind(this)(tag)
            }, [`${tag.name}`])))])]),

            "footer": m("div", {
                "class": "df jb pb6"
            }, [m(Btn, {
                ctx: this.ctx,
                "class": "fg1 h12 bold italic br2 capitalize",
                "size": "large",
                "fill": "outline",
                "color": "secondary-cool",
                "onclick": () => this.selectedTags([])
            }, [`Clear`]), m("div", {
                "class": "w2"
            }), m(Btn, {
                ctx: this.ctx,
                "class": "fg1 h12 bold italic br2 capitalize",
                "size": "large",
                "fill": "solid",
                "color": "secondary-cool",
                "onclick": this.runFilter.bind(this)
            }, [`Apply`])])
        }, []); return this["filterPopup"]; })()]);
    }
};

export default AudioEntryList;

import { fakes } from '../../../models/AudioEntry.ts.proxy.js';
export const states = {
    base: {
        onselect: (entry) => console.log('onselect', entry),
        activeFilters: stream([]),
        view: function base(vnode) {
            this.sync(vnode, ["ctx"]);
            return m(AudioEntryList, {
                ctx: this.ctx,
                "onselect": this.onselect,
                "activeFilters": this.activeFilters
            });
        }
    }
};

export const tests = (o, mq) => {
    o.spec('AudioEntryList', () => {
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