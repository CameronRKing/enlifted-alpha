import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import ColorDef from './design/ColorDef.m.js';
import { colors } from '../theme/css-utils.css.js.js';

const cache = {};

const Icon = {
    innerColor: '',
    innerSize: 24,
    id: '',
    lastIcon: '',
    actualIcon: null,
    root: null,

    setup(vnode) {
        this.sync(vnode, ["ctx", 'color', 'is', 'size', 'onclick', 'portal']);
        // todo: defaults for props
        if (this.size === 'large') this.innerSize = 32;
    },

    oncreate(vnode) {
        this.syncCss();
    },

    getSrc(name) {
        return fetch(`/src/atoms/design/icons/${name}.svg`).then(res => res.text())
    },

    loadIcon(name) {
        if (cache[name]) return Promise.resolve(cache[name]);

        return this.getSrc(name)
            .then(str => m.trust(str))
            .then(node => cache[name] = node);
    },

    onsync(vnode) {
        if (!this.color) this.color = '#F7F7F7';
        if (typeof this.color === 'object') {
            this.id = this.color.name;
            this.innerColor = `url('#${this.id}')`;
        } else {
            if (this.color.startsWith('#')) this.innerColor = this.color;
            else {
                this.innerColor = colors[this.color] ? colors[this.color] : this.color;
            }
        }
        this.syncCss();

        if (this.is !== this.lastIcon) {
            this.lastIcon = this.is;

            this.loadIcon(this.is).then(icon => {
                this.actualIcon = icon;
                const style = {
                    '--icon-color': this.innerColor,
                    '--icon-size': this.innerSize,
                };
                this.root = m('span', { class: 'dfi jc aic', onclick: this.onclick, style }, [
                    m('svg', {
                        width: 0,
                        height: 0,
                        viewBox: '0 0 0 0',
                        fill: 'none',
                        xmlns: 'http://www.w3.org/2000/svg'
                    }, [
                        m(ColorDef, {
                            ctx: this.ctx,
                            color: this.color,
                            id: this.id
                        })
                    ]),
                    this.actualIcon
                ]);
                if (this.onloaded) this.onloaded(this.root);
                m.redraw();
            });

        }

    },

    syncCss() {
        if (this.root && this.root.dom) {
            this.root.dom.style.setProperty('--icon-color', this.innerColor);
            this.root.dom.style.setProperty('--icon-size', this.innerSize);
        }
    },

    view: function Icon(vnode) {
        this.sync(vnode, ["ctx", 'color', 'is', 'size', 'onclick', 'portal']);
        // if (this.onloaded) return null;
        return this.root;
    }
};

export default Icon;

export const states = {
    colors: { 
        localColors: colors,
        view: function colors(vnode) {
            this.sync(vnode, ["ctx"]);
            return m("div", {}, [
                ...(Array.isArray(this.localColors) ? this.localColors.map((color, name) => m(Icon, {
                    ctx: this.ctx,
                    "color": color,
                    "is": "logo"
                })) : Object.entries(this.localColors).map(([name, color]) => m(Icon, {
                    ctx: this.ctx,
                    "color": color,
                    "is": "logo"
                })))
            ]);
        }
    },
};

export const tests = (o, mq) => {
    o.spec('Icon', () => {
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
        reassign(Icon, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Icon).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}