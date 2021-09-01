import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../../../_snowpack/pkg/mithril.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';
import Btn from '../Btn.m.js';
import ScreenStackDirect from './ScreenStackDirect.js';

const ScreenStack = m.cmp({
    add(...args) {
        return this.screenStack.add(...args);
    },
    pop() {
        return this.screenStack.pop();
    },
    swap(...args) {
        return this.screenStack.swap(...args);
    },
    oncreate(vnode) {
        // screen height isn't always setting correctly. attempting a hotfix
        setTimeout(() => {
            this.screenStack = new ScreenStackDirect(this.el.dom, this.ctx);
        }, 16); 
    },
    view: function ScreenStack(vnode) {
        this.sync(vnode, ["ctx"]);
        return (() => { this["el"] = m("div", {
            "class": "wf hf"
        }); return this["el"]; })();
    }
}, (cmp) => __cmps__['ScreenStack'] = cmp);

export default ScreenStack;

const directions = ['up', 'down', 'left', 'right'];
const colors = ['primary-medium', 'primary-cool', 'primary-warm', 'secondary-cool'];

export let states = {
    base: m.cmp({
        reps: 0,
        add() {
            const reps = this.reps;
            this.screenStack.state.add({ style: 'bg-' + colors[reps % 4] + ' wf hf', view: function (vnode) { return m("div", {
                "class": this.style
            }); } }, directions[reps % 4], 1000);
            this.reps += 1;
        },
        pop() {
            this.screenStack.state.pop();
        },
        swap() {
            const idx = this.reps % 4;
            this.screenStack.state.swap({ style: 'bg-' + colors[idx] + ' wf hf', view: function (vnode) { return m("div", {
                "class": this.style
            }); } }, directions[idx], 500);
            this.reps += 1;
        },
        view: function base(vnode) {
            this.sync(vnode, ["ctx"]);
            return m("div", {
                "class": "dfc js pb8"
            }, [m("div", {}, [m(Btn, {
                ctx: this.ctx,
                "onclick": this.swap.bind(this)
            }, [`Swap`]), m(Btn, {
                ctx: this.ctx,
                "onclick": this.add.bind(this)
            }, [`Add`]), m(Btn, {
                ctx: this.ctx,
                "onclick": this.pop.bind(this)
            }, [`Pop`])]), (() => { this["screenStack"] = m(ScreenStack, {
                ctx: this.ctx
            }); return this["screenStack"]; })()]);
        }
    }, (cmp) => __cmps__['base'] = cmp),
    direct: m.cmp({
        reps: 0,
        oncreate(vnode) {
            this.screenStack = new ScreenStackDirect(this.root.dom, this.ctx);
        },
        add() {
            const reps = this.reps;
            const cmp = m.cmp({
                reps,
                pageConfig() {
                    console.log(this.reps);
                    this.ctx.bottomNavVisible(this.reps % 2 === 0);
                },
                sstyle: 'bg-' + colors[reps % 4] + ' wf hf',
                view: function cmp(vnode) {
                    this.sync(vnode, ["ctx"]);
                    return m("div", {
                        "class": this.sstyle
                    });
                }
            }, (cmp) => __cmps__['cmp'] = cmp);
            this.screenStack.add(cmp, directions[reps % 4], 1000);
            this.reps += 1;
        },
        pop() {
            this.screenStack.pop();
        },
        swap() {
            const idx = this.reps % 4;
            const swapped = m.cmp({
                pageConfig() { this.ctx.bottomNavVisible(!this.ctx.bottomNavVisible()); },
                style: 'bg-' + colors[idx] + ' wf hf',
                view: function swapped(vnode) {
                    this.sync(vnode, ["ctx"]);
                    return m("div", {
                        "class": this.style
                    });
                }
            }, (cmp) => __cmps__['swapped'] = cmp);
            this.screenStack.swap(swapped, directions[idx], 500);
            this.reps += 1;
        },
        view: function direct(vnode) {
            this.sync(vnode, ["ctx"]);
            return m("div", {
                "class": "dfc js pb8"
            }, [m("div", {}, [m(Btn, {
                ctx: this.ctx,
                "onclick": this.swap.bind(this)
            }, [`Swap`]), m(Btn, {
                ctx: this.ctx,
                "onclick": this.add.bind(this)
            }, [`Add`]), m(Btn, {
                ctx: this.ctx,
                "onclick": this.pop.bind(this)
            }, [`Pop`])]), (() => { this["root"] = m("div", {
                "class": "w20 h20"
            }); return this["root"]; })()]);
        }
    }, (cmp) => __cmps__['direct'] = cmp)
};

export let tests = (o, mq) => {
    o.spec('ScreenStack', () => {
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
