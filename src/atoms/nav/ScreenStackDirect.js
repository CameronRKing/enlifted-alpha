import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import BottomNav from './Bottom.m.js';
import TopNav from './Top.m.js';


const capitalize = (str) => str[0].toUpperCase() + str.slice(1);
const DEFAULT_SPEED = 400;

export default class ScreenStackDirect {
    wrapperStyle = {};
    screenStyle = {};
    styleStack = [];
    contextMap = new Map();
    animating = stream(false);
    bottomNavVisible = stream(false);
    bottomNavBgColor = stream('');
    rootEl = null; // the DOM element that holds all other elements
    wrapper = null; // the DOM element that hold all the screens
    screens = []; // array of DOM elements with components mounted into them

    constructor(el, ctx) {
        this.rootEl = el;
        this.ctx = ctx;
        this.analytics = ctx.analytics;

        const { clientWidth, clientHeight } = el.parentElement;
        this.wrapperStyle = {
            height: clientHeight + 'px',
            width: clientWidth + 'px',
        };
        this.screenStyle = { ...this.wrapperStyle, position: 'absolute' };
        Object.entries(this.wrapperStyle).forEach(([key, val]) => el.style.setProperty(key, val));

        this.wrapper = document.createElement('div');
        this.bottomNavEl = document.createElement('div');
        this.rootEl.appendChild(this.wrapper);
        this.rootEl.appendChild(this.bottomNavEl);

        const self = this;

        m.mount(this.bottomNavEl, {
            setup() {
                this.lastVisible = null;
                stream.lift(() => m.redraw(), self.bottomNavBgColor, self.bottomNavVisible, self.animating);
            },
            view(vnode) {
                const visible = self.bottomNavVisible();
                const animating = self.animating();
                // the display logic needs to be a little more complicated
                // we need `becomingInvisible` 
                const becomingInvisible = this.lastVisible && !visible && animating;
                this.lastVisible = visible;
                const cclass = `${(!visible && !becomingInvisible) ? 'dn' : '' } animate__animated animate__fade` + (visible ? 'In' : 'Out');

                self.bottomNav = m(BottomNav, {
                    ctx: self.ctx,
                    class: cclass,
                    bgColor: self.bottomNavBgColor(),
                });

                return self.bottomNav;
            }
        });
    }

    async add(cmp, direction='', props={}, speed=DEFAULT_SPEED) {
        this.analytics.setSuperProps({ 'Page Name': cmp.view.name });
        this.analytics.emit('View Page');

        this.styleStack.push({ direction, speed });
    
        // DOM/component creation
        const el = document.createElement('div');
        const self = this;
        let resolve;
        const stateGotten = new Promise(res => resolve = res);
        m.mount(el, {
            oncreate(vnode) { resolve(this.ref.state); },
            view(vnode) {
                const ctx = self.getCtx(cmp);
                return m(`div.p5.pb16.fg1.ovya.hf.wf.bg-${ctx.bgColor()}`, [
                    ctx.topNavVisible() ? m(TopNav, { config: ctx.topNavConfig(), ctx }) : null,
                    (() => { this.ref = m(cmp, { ...props, ctx }); return this.ref; })()
                ]);
            }
        });
        const state = await stateGotten;


        // styling
        Object.assign(el.style, this.screenStyle);
        Object.entries(this.screenStyle).forEach(([key, val]) => el.style.setProperty(key, val));
        el.style.setProperty('--animate-duration', speed + 'ms');
        const animation = `animate__slideIn${capitalize(direction)}`;
        el.classList.toggle('animate__animated');
        el.classList.toggle(animation);

        // adding new element into the mix
        if (typeof state.pageConfig === 'function') state.pageConfig();
        m.redraw();
        this.bottomNav.state.forceUpdate();
        this.screens.push({ el, cmp, state });
        this.animating(true);
        this.wrapper.appendChild(el);

        setTimeout(() => {
            this.bottomNav.state.forceUpdate();
            el.classList.toggle(animation);
            this.animating(false);
        }, speed);
    }

    pop() {
        const { direction, speed } = this.styleStack.pop();
        const { el } = this.screens.pop();
        const prev = this.screens.length ? this.screens.last().cmp : null;
        
        if (prev) {
            const state = this.screens.last().state;
            if (typeof state.pageConfig === 'function') state.pageConfig();
            this.analytics.setSuperProps({ 'Page Name': prev.view.name });
            this.analytics.emit('View Page');
        }

        const opposites = {
            up: 'down',
            down: 'up',
            left: 'left',
            right: 'right'
        };

        el.classList.toggle('animate__slideOut' + capitalize(opposites[direction]));
        this.animating(true);
        this.bottomNav.state.forceUpdate();

        setTimeout(() => {
            this.animating(false);
            m.redraw();
            this.bottomNav.state.forceUpdate();
            el.remove();
            m.mount(el, null); // necessary for cleaning up Mithril internal state and preventing memory leaks
        }, speed);
    }

    // todo: fix this last method
    // then drop the component into place and see if it works
    async swap(cmp, direction, props={}, speed=DEFAULT_SPEED) {
        this.analytics.setSuperProps({ 'Page Name': cmp.view.name });
        this.analytics.emit('View Page');

        // DOM/component creation
        const el = document.createElement('div');
        const self = this;
        let resolve;
        const stateGotten = new Promise(res => resolve = res);
        m.mount(el, {
            oncreate(vnode) { resolve(this.ref.state); },
            view(vnode) {
                const ctx = self.getCtx(cmp);
                return m(`div.p5.pb16.fg1.ovya.hf.wf.bg-${ctx.bgColor()}`, [
                    ctx.topNavVisible() ? m(TopNav, { config: ctx.topNavConfig(), ctx }) : null,
                    (() => { this.ref = m(cmp, { ...props, ctx }); return this.ref; })()
                ]);
            }
        });
        const state = await stateGotten;

        // styling: new page
        Object.entries(this.screenStyle).forEach(([key, val]) => el.style.setProperty(key, val));
        el.style.setProperty('--animate-duration', speed + 'ms');
        const animation = `animate__slideIn${capitalize(direction)}`;
        el.classList.toggle('animate__animated');
        el.classList.toggle(animation);

        const opposites = {
            up: 'up',
            down: 'down',
            left: 'right',
            right: 'left'
        };

        // styling: previous page
        const prev = this.screens.pop();
        if (prev && prev.el) {
            prev.el.style.setProperty('--animate-duration', speed + 'ms');
            prev.el.classList.toggle(`animate__slideOut${capitalize(opposites[direction])}`);
        }

        // adding new element into the mix
        if (typeof state.pageConfig === 'function') state.pageConfig();
        this.animating(true);
        this.bottomNav.state.forceUpdate();
        this.screens.push({ el, cmp, state });
        this.wrapper.appendChild(el);

        setTimeout(() => {
            if (prev && prev.el) {
                // clean up Mithril internals (destroy screen)
                m.mount(prev.el, null);
                prev.el.remove();
            }
            this.animating(false);
            m.redraw();
            this.bottomNav.state.forceUpdate();
            el.classList.toggle(animation);
        }, speed);
    }

    getCtx(screen) {
        if (!this.contextMap.has(screen)) {
            const clone = Object.assign({}, this.ctx);
            const ctx = Object.assign(clone, {
                bgColor: stream('black'),
                topNavVisible: stream(false),
                topNavConfig: stream({}),
                bottomNavVisible: this.bottomNavVisible,
                bottomNavBgColor: this.bottomNavBgColor,
                runSetup: stream(),
            });
            // when config is set, assume nav wants to be seen
            ctx.topNavConfig.map((obj) => ctx.topNavVisible(obj !== null));
            ctx.bottomNavBgColor.map(color => {
                const wasVisible = ctx.bottomNavVisible();

                const shouldProc = wasVisible && color == '' || !wasVisible && color !== '';
                if (shouldProc) ctx.bottomNavVisible(!wasVisible);
            });
            ctx.bottomNavVisible.map(visible => {
                const hasColor = ctx.bottomNavBgColor() !== '';
                if (!visible && hasColor) ctx.bottomNavBgColor('');
            })

            stream.lift(m.redraw,
                ctx.bgColor, ctx.topNavVisible, ctx.topNavConfig,
            );
            this.contextMap.set(screen, ctx);
        }

        return this.contextMap.get(screen);
    }
}