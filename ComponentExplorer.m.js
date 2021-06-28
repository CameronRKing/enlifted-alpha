import * as __SNOWPACK_ENV__ from './_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from './_snowpack/pkg/mithril.js';
import stream from './_snowpack/pkg/mithril/stream.js';
import MobileShell from './explorer/MobileShell.m.js';
import TestExplorer from './explorer/Tests.m.js';
import Btn from './src/atoms/Btn.m.js';

const ComponentExplorer = {
    // had to rename to avoid conflict with exports
    stories: stream({}),
    // testFn: stream(() => {}),
    path: stream([]),
    visible: stream('tests'),
    ctx: {},
    setup(vnode) {
        this.sync(vnode, ["ctx"]);
        const firstVisible = window.localStorage.getItem('component-explorer.visible');
        this.visible(firstVisible);
        this.visible.map(visible => window.localStorage.setItem('component-explorer.visible', visible));
        this.testFn = stream(() => {});
        stream.lift(m.redraw, this.stories, this.testFn, this.visible);

        this.path(m.route.param('path'));
        import(`./${this.path()}`).then(mod => {
            this.stories(mod.states || {});
            this.testFn(mod.tests || (() => {}));
        });
    },
    view: function ComponentExplorer(vnode) {
        this.sync(vnode, ["ctx"]);
        return m("div", {
            "class": "dfw ovya ovxa maxhf"
        }, [m("div", {}, [m(Btn, {
            ctx: this.ctx,
            "onclick": () => this.visible('stories')
        }, [`View stories`]), m(Btn, {
            ctx: this.ctx,
            "onclick": () => this.visible('tests')
        }, [`Tests`])]), ...(Array.isArray(this.stories()) ? this.stories().map((state, name) => this.visible() === 'stories' && !this.path().startsWith('src/atoms/nav') ? m(MobileShell, {
            ctx: this.ctx,
            "cmp": state,
            "ctx": Object.assign(Object.assign({}, this.ctx), { portalPrefix: name })
        }, [`${name}`]) : null) : Object.entries(this.stories()).map(([name, state]) => this.visible() === 'stories' && !this.path().startsWith('src/atoms/nav') ? m(MobileShell, {
            ctx: this.ctx,
            "cmp": state,
            "ctx": Object.assign(Object.assign({}, this.ctx), { portalPrefix: name })
        }, [`${name}`]) : null)), ...(Array.isArray(this.stories()) ? this.stories().map((state, name) => this.visible() === 'stories' && this.path().startsWith('src/atoms/nav') ? m(state, {
            ctx: this.ctx
        }) : null) : Object.entries(this.stories()).map(([name, state]) => this.visible() === 'stories' && this.path().startsWith('src/atoms/nav') ? m(state, {
            ctx: this.ctx
        }) : null)), this.visible() === 'tests' ? m(TestExplorer, {
            ctx: this.ctx,
            "testFn": this.testFn
        }) : null]);
    }
};

export default ComponentExplorer;

export const states = {
    // welcome to infinite recursion
    // perhaps this component shouldn't know that it's in a route?
        // is it easy to pass route params into components as props?
    // base: { view: m.xhtml`<ComponentExplorer />` }
};

export const tests = (o, mq) => {
    o.spec('ComponentExplorer', () => {
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
        reassign(ComponentExplorer, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === ComponentExplorer).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}