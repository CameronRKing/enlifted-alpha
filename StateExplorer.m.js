import * as __SNOWPACK_ENV__ from './_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from './_snowpack/pkg/mithril.js';
import Btn from './src/atoms/Btn.m.js';
import Sidebar from './Sidebar.m.js';
import TestExplorer from './TestExplorer.m.js';
import CodeEditor from './CodeEditor.m.js';
import TreeInspector from './inspector/TreeInspector.m.js';
import TraceTimeline from './TraceTimeline.m.js';
import makeClient from './Client.js';

const StateExplorer = {
    socket: makeClient(),
    statePaths: [],
    watching: {
        curr: './src',
        old: './grimoire'
    },
    currCmp: null,
    states: {},
    tests: null,
    nodes: {},
    tree: [],
    findVnode: m.find,
    switchDir() {
        const { old, curr } = this.watching;
        this.socket.switchDir(old).then(() => m.redraw());
        this.watching.old = curr;
        this.watching.curr = old;
    },
    viewStates(path) {
        this.currCmp = path;
        return import(`./${path.replace(/^grimoire\//, '')}`).then(mod => {
            this.states = mod.states || {};
            this.tests = mod.tests;
            if (!this.tests) this.tests = () => {};
            console.log('tests', this.tests);
            // small annoyance: autoredraw doesn't detect async handlers
            // how hard could it be to fix?
            m.redraw();
        });
    },
    parseTree() {
        return this.statePaths.reduce((acc, path) => {
            const folders = path.split('/').slice(0, -1);
            let node = acc;
            folders.forEach(folder => {
                const found = node.children.find(kid => kid.name === folder);
                if (found) {
                    node = found;
                } else {
                    const newKid = { name: folder, children: [] };
                    node.children.push(newKid);
                    node.children.sort((l, r) => l.name < r.name);
                    node = newKid;
                }
            });
            node.children.push({ name: this.cmpName(path), path });
            return acc;
        }, { name: 'root', children: [] }).children;
    },
    oninit: function(vnode) {
        window.root = vnode;
        this.socket.onStates(statesAvailable => {
            this.statePaths = JSON.parse(statesAvailable);
            this.tree = this.parseTree();
            const givenRoot = this.statePaths[0].split('/')[0];
            if (`./${givenRoot}` != this.watching.curr) {
                const { old, curr } = this.watching;
                this.watching.curr = old;
                this.watching.old = curr;
            }
            m.redraw();
        });
    },
    onupdate(vnode) {
        if (Object.keys(this.nodes).length === Object.keys(this.states).length) return;

        this.nodes = {};
        Object.entries(this.states).forEach(([name, state]) => {
            this.nodes[name] = this.findVnode(node => node.tag === state)
        });
    },
    cmpName(path) {
        return path.split('/').reverse()[0].split('.m.js')[0];
    },
    view: function(vnode) {
        return m('.df.js.ais.wf.hf',
            m(Sidebar, { tree: this.tree, onselect: node => this.viewStates(node.path) }),
            m('.dfc.js.ais.wf.hf.ovya',
                m(Btn, { attrs: { onclick: () => this.switchDir() }}, 'Switch to ' + this.watching.old),
                this.currCmp ? m('.df.wf.maxh64', m('.w50p', m(CodeEditor, { path: this.currCmp })), m('.w50p.ovya', m(TraceTimeline))) : null,
                Object.entries(this.states).map(([name, state]) => 
                    m('.p4',
                        m('h2', name),
                        m(state),
                        m(TreeInspector, { node: this.nodes[name] })
                    )
                ),
                m(TestExplorer, { tests: this.tests })
            )
        );
    }
}
export default StateExplorer;
if (undefined /* [snowpack] import.meta.hot */ ) {
    undefined /* [snowpack] import.meta.hot */ .accept(({ module }) => {
        const reassign = (stale, fresh) => {
            Object.keys(stale).forEach(key => delete stale[key]);
            Object.assign(stale, fresh);
        }
        // for this to work effectively, m.js files should quietly export a list of their known components

        // updates will catch, but they won't rerun lifecycle methods
        reassign(StateExplorer, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === StateExplorer).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}