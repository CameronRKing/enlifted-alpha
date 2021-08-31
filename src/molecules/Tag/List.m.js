import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import Icon from '../../atoms/Icon.m.js';

// https://www.w3docs.com/snippets/javascript/how-to-calculate-text-width-with-javascript.html
function displayTextWidth(text, font) {
    let canvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext('2d');
    context.font = font;
    let metrics = context.measureText(text);
    return metrics.width;
}

const TagList = m.cmp({
    setup(vnode) {
        this.sync(vnode, ["ctx", 'tags', 'nowrap', 'color']);
        this.tagsThatFit = stream([]);
        this.leftoverTags = stream([]);
        this.availableWidth = 0;
        this.lastTags = '';
    },

    oncreate(vnode) {
        if (!this.nowrap) {
            this.tagsThatFit(this.tags.map(tag => tag.name));
            return;
        }

        const width = this.tagWrapper.dom.offsetWidth;
        // subtract size of "+1" box and its padding
        this.availableWidth = width - 30 - (4 * 2);

        this.drawTags();
    },

    onsync() {
        const memento = () => this.tags.map(tag => tag.name).join(', ');
        if (memento() !== this.lastTags) {
            this.lastTags = memento();

            if (this.availableWidth) this.drawTags();
            else if (!this.nowrap && this.tagsThatFit) this.tagsThatFit(this.tags.map(tag => tag.name));
        }
    },

    drawTags() {
        let currentText = '';
        const fittingTags = this.tags.map(tag => tag.name)
            .filter(tag => {
                currentText += (currentText === '' ? tag : ', ' + tag);
                const actualWidth = displayTextWidth(currentText, '16pt "Avenir Medium"');
                return actualWidth < this.availableWidth;
            });
        const tagsRemaining = this.tags.slice(fittingTags.length);
        this.tagsThatFit(fittingTags);
        this.leftoverTags(tagsRemaining);
        m.redraw();
    },

    view: function TagList(vnode) {
        this.sync(vnode, ["ctx", 'tags', 'nowrap', 'color']);
        return m("div", {
            "class": "df js ais"
        }, [m(Icon, {
            ctx: this.ctx,
            "is": "tag",
            "color": this.color
        }), (() => { this["tagWrapper"] = m("div", {
            "class": 'pl2 fg1 tc-' + this.color
        }, [`${this.tagsThatFit().join(', ')}
                `, this.leftoverTags().length ? m("span", {
            "class": "br1 bg-gray-twenty p1 sm-body"
        }, [`+${this.leftoverTags().length} 
                `]) : null]); return this["tagWrapper"]; })()]);
    }
}, (cmp) => __cmps__['TagList'] = cmp);

export default TagList;

export let states = {
    base: { view: function (vnode) { return m(TagList); } }
};

export let tests = (o, mq) => {
    o.spec('TagList', () => {
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