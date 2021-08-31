import * as __SNOWPACK_ENV__ from '../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from '../_snowpack/pkg/mithril.js';
import Sidebar from '../Sidebar.m.js';

function nodeName(node) {
    if (!(node && node.tag)) return '< no node >';
    // Mithril doesn't know the names of components like other frameworks
    // to save them, I'm choosing to name the view function like `${CmpName}Tag`
    // the `Tag` append is important, because using the name as-is causes some recursion error
    //
    // update: it WAS causing some recursion error. It no longer appears to do so.
    if (node.tag.view) return node.tag.view.name;
    // if not a view function, it's a string
    return node.tag;
}

const TreeInspector = {
    node: {},
    syncNode(node) {
        if (this.node === node) return;
        this.node = node;
        m.redraw();
    },
    nodeName,
    tagTree() {
        if (!this.node) return [{ name: '< no node >' }];

        const tree = [];
        const buildTree = (node, branch) => {
            if (!node) return;
            const treeItem = { name: this.nodeName(node), node, children: [] };
            // sometimes node.children is an object?s
            if (node.children && Array.isArray(node.children) && node.children.length) {
                node.children
                    .filter(kid => typeof kid !== 'string')
                    .forEach(kid => buildTree(kid, treeItem.children));
            } else if (node.instance) {
                buildTree(node.instance, treeItem.children);
            }
            branch.push(treeItem);
        }
        buildTree(this.node, tree);
        return tree;
    },
    oninit(vnode) {
        this.syncNode(vnode.attrs.node);
    },
    onupdate(vnode) {
        this.syncNode(vnode.attrs.node);
    },
    onselect(item) {
        window.node = item.node;
        console.log('available as `window.node`', window.node);
    },
    view: function TreeInspectorTag(vnode) {
        return m('div',
            m(Sidebar, { tree: this.tagTree(), onselect: this.onselect })
        );
    }
};

export default TreeInspector;

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