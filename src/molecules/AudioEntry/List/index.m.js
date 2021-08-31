import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../../_snowpack/pkg/mithril.js';
import stream from '../../../../_snowpack/pkg/mithril/stream.js';
import Popup from '../../../atoms/Popup.m.js';
import Pill from '../../../atoms/Pill.m.js';
import Btn from '../../../atoms/Btn.m.js';
import Icon from '../../../atoms/Icon.m.js';
import EntrySummary from '../Summary/index.js';
import AudioEntry from '../../../models/AudioEntry.js';
import TagCategory, { NoneReady } from '../../../models/TagCategory.js';

// this should really be abstracted into a component
const tagSelectedStyle = 'tc-white bg-secondary-cool';

const AudioEntryList = m.cmp({
    async setup(vnode) {
        this.sync(vnode, ["ctx", 'onselect', 'activeFilters']);
        this.filterClosedSelf = stream();
        this.ready = stream(false);
        this.visible = stream([]);
        this.available = stream([]);
        (await AudioEntry.allSubscribe()).map(this.available);
        this.entryCount = 0;
        this.selectedTags = stream([]);
        this.visible(this.available());
        this.entryCount = this.available().length;
        await NoneReady;
        this.allTags = (await TagCategory.None.tags()).sort((l, r) => l.name.localeCompare(r.name));

        stream.lift((tags, entries) => {
            // currently doing the filter in-memory
            // selecting multiple tags is an AND operation
            this.visible(entries.filter(entry =>
                tags.reduce((acc, tag) => acc && entry.tags.some(tt => tt.name == tag.name), true)    
            ));
        }, this.activeFilters, this.available);

        this.ready(true);

        this.filterClosedSelf.map(() => {
            this.ctx.analytics.emit('Filter Drawer Close');
        })

        stream.lift(() => m.redraw(), this.visible, this.available);
    },

    popFilters() {
        this.ctx.analytics.emit('Filter Drawer Open');

        // reset filter state if out of sync
        if (this.activeFilters() !== this.selectedTags()) {
            this.selectedTags(this.activeFilters().slice());
        }

        this.filterPopup.state.open(true);
    },

    tagStyle(tag) {
        return this.selectedTags().includes(tag) ? tagSelectedStyle : '';
    },

    toggleFilter(tag, withAnalytics=true) {
        const tags = this.selectedTags();
        // Array.remove is defined in @/boot/utils.js

        if (tags.includes(tag)) {
            if (withAnalytics) this.ctx.analytics.emit('Filter Remove Tag', { tag: tag.name });
            tags.remove(tag);
        } else {
            if (withAnalytics) this.ctx.analytics.emit('Filter Add Tag', { tag: tag.name });
            tags.push(tag);
        }

        this.selectedTags(tags);
    },

    runFilter() {
        this.activeFilters(this.selectedTags().slice());
        this.filterPopup.state.open(false);
    },

    view: function AudioEntryList(vnode) {
        this.sync(vnode, ["ctx", 'onselect', 'activeFilters']);
        return this.ready() ? m("div", {
            "class": "dfc js pb24"
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
                "onclick": () => { this.ctx.analytics.emit('Remove Tag', { tag: tag.name }); this.toggleFilter.bind(this)(tag, false); this.runFilter.bind(this)(); }
            }), `${tag.name}
                        `])) : Object.entries(this.activeFilters()).map(([_, tag]) => m(Pill, {
                ctx: this.ctx,
                "style": "sm-body tc-white bg-secondary-cool dfi jb aic ml0 mr2"
            }, [m(Icon, {
                ctx: this.ctx,
                "is": "cross",
                "onclick": () => { this.ctx.analytics.emit('Remove Tag', { tag: tag.name }); this.toggleFilter.bind(this)(tag, false); this.runFilter.bind(this)(); }
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
            "selfClosed": this.filterClosedSelf,
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
                "onclick": () => { this.ctx.analytics.emit('Filter Clear'); this.selectedTags([]); }
            }, [`Clear`]), m("div", {
                "class": "w2"
            }), m(Btn, {
                ctx: this.ctx,
                "class": "fg1 h12 bold italic br2 capitalize",
                "size": "large",
                "fill": "solid",
                "color": "secondary-cool",
                "onclick": () => { this.ctx.analytics.emit('Filter Apply'); this.runFilter.bind(this)(); }
            }, [`Apply`])])
        }, []); return this["filterPopup"]; })()]) : null;
    }
}, (cmp) => __cmps__['AudioEntryList'] = cmp);

export default AudioEntryList;

import { fakes } from '../../../models/AudioEntry.js';
export let states = {
    base: m.cmp({
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
    }, (cmp) => __cmps__['base'] = cmp)
};

export let tests = (o, mq) => {
    o.spec('AudioEntryList', () => {
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