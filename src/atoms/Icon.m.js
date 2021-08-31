import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
import ColorDef from './design/ColorDef.m.js';
import { colors } from '../theme/css-utils.css.js.js';

let prefix = '';
if (__SNOWPACK_ENV__ && __SNOWPACK_ENV__.MODE === 'production') {
    prefix = '/enlifted-alpha';
}

const cache = {};

const Icon = m.cmp({
    innerColor: '',
    innerSize: 24,
    id: '',
    lastIcon: '',
    actualIcon: null,
    root: null,

    setup(vnode) {
        this.sync(vnode, ["ctx", 'color', 'is', 'size', 'onclick']);
        // todo: defaults for props
        if (this.size === 'large') this.innerSize = 32;
    },

    oncreate(vnode) {
        this.syncCss();
    },

    getSrc(name) {
        return fetch(`${prefix}/src/atoms/design/icons/${name}.svg`).then(res => res.text())
    },

    loadIcon(name) {
        if (cache[name]) return Promise.resolve(cache[name]);

        return this.getSrc(name).then(str => cache[name] = str);
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

        if (this.is !== this.lastIcon || !this.actualIcon) {
            this.lastIcon = this.is;

            this.loadIcon(this.is).then(icon => {
                this.actualIcon = icon;
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

    view(vnode) {
        this.sync(vnode, ["ctx", 'color', 'is', 'size', 'onclick']);
        if (!this.actualIcon) return null;

        const style = {
            '--icon-color': this.innerColor,
            '--icon-size': this.innerSize,
        };
        return m('span', { class: 'dfi jc aic', onclick: this.onclick, style }, [
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
            m.trust(this.actualIcon)
        ]);
    }
}, (cmp) => __cmps__['Icon'] = cmp);

export default Icon;

export let states = {
    colors: m.cmp({ 
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
    }, (cmp) => __cmps__['colors'] = cmp),
};

export let tests = (o, mq) => {
    o.spec('Icon', () => {
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