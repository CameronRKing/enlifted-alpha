import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from '../_snowpack/pkg/mithril.js';
import stream from '../_snowpack/pkg/mithril/stream.js';
import o from '../_snowpack/pkg/ospec.js';
import mq from '../_snowpack/pkg/mithril-query.js';
import Btn from '../src/atoms/Btn.m.js';

// two names: one to match mithril-hmr (Tests),
// one for more expressive inspection (TestExplorer)
const TestExplorer = {
    watch: stream(true),

    setup(vnode) {
        this.sync(vnode, ["ctx", 'testFn']);
        this.specs = this.testFn.map(testFn => {
            const runner = this.makeRunner(testFn);
            const specList = [];
            const pullSpecs = (spec, stack) => {
                Object.entries(spec.children).forEach(([key, val]) => {
                    const context = stack.length ? `${stack} > ${key}` : key;
                    // recurse! it's a spec
                    if (val.children) pullSpecs(val, context);
                    // base case! it's a test
                    else specList.push(({ context }));
                });
            }
            
            pullSpecs(runner.rootSpec, '');

            return specList;
        });

        this.testFn.map(testFn => {
            if (this.watch()) {
                this.runAll();
            }
        });
    },

    makeRunner(testFn) {
        const runner = o.new();
        testFn(runner, mq);
        return runner;
    },

    runAll() {
        const runner = this.makeRunner(this.testFn());
        runner.run(results => {
            const specs = this.specs();
            window.tests = specs;
            results.forEach(res => {
                const test = specs.find(spec => spec.context === res.context);
                test.results = res;
                if (!res.pass) console.warn(res.error);
            })
            m.redraw();
        });
    },

    view: function TestExplorer(vnode) {
        this.sync(vnode, ["ctx", 'testFn']);
        return m("div", {
            "class": "dfc js ais ovya maxhf"
        }, [this.specs().length ? m(Btn, {
            ctx: this.ctx,
            "onclick": this.runAll.bind(this),
            "color": "secondary",
            "fill": "outline"
        }, [`Run all`]) : null, ...(Array.isArray(this.specs()) ? this.specs().map((spec) => m(
            "div",
            {},
            [m("h2", {}, [`${spec.context}`]), spec.results ? m("div", {}, [
                m("p", {}, [`${spec.results.pass ? 'Pass' : 'Fail'}`]),
                !spec.results.pass ? m("pre", {}, [`${spec.results.error.stack}`]) : null
            ]) : null]
        )) : Object.entries(this.specs()).map(([_, spec]) => m(
            "div",
            {},
            [m("h2", {}, [`${spec.context}`]), spec.results ? m("div", {}, [
                m("p", {}, [`${spec.results.pass ? 'Pass' : 'Fail'}`]),
                !spec.results.pass ? m("pre", {}, [`${spec.results.error.stack}`]) : null
            ]) : null]
        )))]);
    }
};
const Tests = TestExplorer;

export default TestExplorer;

export const states = {};
if (undefined /* [snowpack] import.meta.hot */ ) {
    undefined /* [snowpack] import.meta.hot */ .accept(({ module }) => {
        const reassign = (stale, fresh) => {
            Object.keys(stale).forEach(key => delete stale[key]);
            Object.assign(stale, fresh);
        }
        // for this to work effectively, m.js files should quietly export a list of their known components

        // updates will catch, but they won't rerun lifecycle methods
        reassign(Tests, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === Tests).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}