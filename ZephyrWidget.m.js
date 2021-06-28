import * as __SNOWPACK_ENV__ from './_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import m from './_snowpack/pkg/mithril.js';
import Zephyr from './Zephyr.m.js';

let ZephyrWidget;
export default (editor, monaco, path) => {
    // widget.toggle() isn't binding `this` to anything,
    // so these properties must exist in the context rather than on the object
    const isZephyrOpen = editor.createContextKey('zephyr.isOpen', false);
    let disposeListeners = null;

    ZephyrWidget = {
        // widget essentials
        getDomNode() {
            if (!this.domNode) {
                this.domNode = document.createElement('div');
                // here's a thing: m.find/findAll won't detect these nodes
                // so I need to update mount to store all the roots it renders
                m.mount(this.domNode, this.cmp);
            }

            return this.domNode;
        },
        getId() {
            return 'zephyr';
        },
        getPosition() {
            return {
                position: editor.getPosition(),
                preference: [monaco.editor.ContentWidgetPositionPreference.BELOW]
            }
        },
        domNode: null,
        cmp: {
            zcmp: null,
            // adding the render syntax junked this logic
            // there needs to be a map between source code locations of render fns and xhtml elements
            // for this and for error-presentation
            // . . .
            // we'll tackle that when it becomes an issue
            // there are bigger issues to tackle in Grimoire right now than Zephyr
            // I was so excited about Zephyr, but it's more icing than cake
            findPosOfPrevRenderFn() {
                const pos = editor.getPosition();
                const match = editor.getModel().findPreviousMatch(/m\(/, pos, true, false, null, true);
                return {
                    lineNumber: match.range.startLineNumber,
                    column: match.range.startColumn
                };
            },
            getSrc() {
                const pos = this.findPosOfPrevRenderFn();
                const file = path.split('/').slice(-1)[0];
                // snowpack adds 5 lines to the top of every file for hot reloading
                return `${file}:${pos.lineNumber + 5}:${pos.column}`
            },
            previewOption(option, lastSelected, isSameFamily) {
                const src = this.getSrc();
                const nodes = m.findAll(node => node.meta && node.meta.src === src);

                // remove last selected if it's part of the same family
                if (isSameFamily) {
                    nodes.forEach(node => {
                        node.dom.classList.remove(lastSelected.util);
                    });
                }
                
                nodes.forEach(node => node.dom.classList.add(option.util));
            },
            word: '',
            view() {
                // I wish mithril had a Vue-like refs system
                this.zcmp = m(Zephyr, { word: this.word, previewOption: this.previewOption.bind(this) });
                return this.zcmp;
            }
        },
        // managing widget presence
        toggle() {
            const setupListeners = () => {
                // keep zephyr widget aligned with cursor position
                let cursorListener = editor.onDidChangeCursorPosition(() => editor.layoutContentWidget(ZephyrWidget));
                // keep zephyr word aligned with word under cursor
                let changeListener = editor.getModel().onDidChangeContent((e) => {
                    const pos = editor.getPosition();
                    // there's a bug in VSCode: when deleting characters, getPosition() returns a wrong value when called in this context
                    // for some reason, the column is INCREMENTED by one instead of DECREMENTED
                    // calling getPosition() outside this handler returns the correct result
                    if (e.changes[0].text == '') { // the change is '' if a character is removed
                        pos.column -= 2;
                    }

                    const { word } = editor.getWordAt(pos);
                    ZephyrWidget.setWord(word);
                });

                disposeListeners = () => {
                    cursorListener.dispose();
                    changeListener.dispose();
                    disposeListeners = null;
                }
            };
            if (isZephyrOpen.get()) {
                disposeListeners();
                editor.removeContentWidget(ZephyrWidget);
                isZephyrOpen.set(false);
            } else {
                setupListeners();

                editor.addContentWidget(ZephyrWidget);
                isZephyrOpen.set(true);
                // init first word
                const pos = editor.getPosition();
                pos.column -= 1;
                ZephyrWidget.setWord(editor.getWordAt(pos).word);
            }
        },
        // useful functions for clients to consume
        setWord(word) {
            this.cmp.word = word;
            m.redraw();
        },
        getWord() {
            return this.domNode.vnode.state.zcmp.state.getSelected();
        },
        accept() {
            const text = this.getWord();
            const { range } = editor.getWordAt(editor.getPosition());
            range.endColumn -= 1;
            editor.getModel().pushEditOperations(editor.getSelections(), [{ text, range }], () => null);
        },
        cycleNext() {
            this.domNode.vnode.state.zcmp.state.cycleNext();
        },
        cyclePrev() {
            this.domNode.vnode.state.zcmp.state.cyclePrev();
        },
    };

    return ZephyrWidget;
};
if (undefined /* [snowpack] import.meta.hot */ ) {
    undefined /* [snowpack] import.meta.hot */ .accept(({ module }) => {
        const reassign = (stale, fresh) => {
            Object.keys(stale).forEach(key => delete stale[key]);
            Object.assign(stale, fresh);
        }
        // for this to work effectively, m.js files should quietly export a list of their known components

        // updates will catch, but they won't rerun lifecycle methods
        reassign(ZephyrWidget, module.default);
        console.log('reassigning');
        // this method will force the components to re-render from scratch
        m.findAll(node => node.tag === ZephyrWidget).forEach(node => node.tag = module.default);

        // states/tests may not be defined
        try { reassign(states, module.states); } catch (e) {}
        try { reassign(tests, module.tests); } catch (e) {}

        m.redraw();
    });
}