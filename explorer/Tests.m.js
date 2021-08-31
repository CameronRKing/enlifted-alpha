import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../_snowpack/pkg/mithril.js';
import stream from '../_snowpack/pkg/mithril/stream.js';
import o from '../_snowpack/pkg/ospec.js';
import mq from '../_snowpack/pkg/mithril-query.js';
import Btn from '../src/atoms/Btn.m.js';

// two names: one to match mithril-hmr (Tests),
// one for more expressive inspection (TestExplorer)
const TestExplorer = m.cmp({
    watch: stream(true),

    setup(vnode) {
        this.sync(vnode, ["ctx", 'testFn']);
        this.results = [];
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
            this.results = results;
            results.forEach(res => {
                const test = specs.find(spec => spec.context === res.context);
                if (!test) return;
                test.results = res;
                if (!res.pass) console.warn(res.error);
            })
            m.redraw();
        });
    },

    // <div :for="spec in specs()">
    //     <h2>{ spec.context }</h2>
    //     <div :if="spec.results">
    //         <p>{ spec.results.pass ? 'Pass' : 'Fail' }</p>
    //         <pre :if="!spec.results.pass">{ spec.results.error.stack }</pre>
    //     </div>
    // </div>
    view: function TestExplorer(vnode) {
        this.sync(vnode, ["ctx", 'testFn']);
        return m("div", {
            "class": "dfc js ais ovya maxhf"
        }, [this.specs().length ? m(Btn, {
            ctx: this.ctx,
            "onclick": this.runAll.bind(this),
            "color": "secondary",
            "fill": "outline"
        }, [`Run all`]) : null, ...(Array.isArray(this.results) ? this.results.map((result) => m("div", {}, [
            m("h2", {}, [`${result.context}`]),
            m("p", {}, [`${result.pass ? 'Pass' : 'Fail'}`]),
            m("p", {}, [`${result.message}`]),
            !result.pass ? m("pre", {}, [`${result.error.stack}`]) : null
        ])) : Object.entries(this.results).map(([_, result]) => m("div", {}, [
            m("h2", {}, [`${result.context}`]),
            m("p", {}, [`${result.pass ? 'Pass' : 'Fail'}`]),
            m("p", {}, [`${result.message}`]),
            !result.pass ? m("pre", {}, [`${result.error.stack}`]) : null
        ])))]);
    }
}, (cmp) => __cmps__['TestExplorer'] = cmp);
const Tests = TestExplorer;

export default TestExplorer;

export const states = {};
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