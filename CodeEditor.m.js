import * as __SNOWPACK_ENV__ from './_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import m from './_snowpack/pkg/mithril.js';
import makeClient from './Client.js';
import makeZephyr from './ZephyrWidget.m.js';
import monacoLoaded from './src/boot/loadMonaco.js';

const client = makeClient();

const CodeEditor = {
    client,
    editor: null,
    root: null,
    path: '',
    onupdate(vnode) {
        if (vnode.attrs.path != this.path) {
            this.path = vnode.attrs.path;
            client.read(this.path)
                .then(src => this.editor.setValue(src))
                .then(() => m.redraw());
        }
    },
    // the issue isn't lifecycle hooks not running
    // the issue is my not understanding when lifecycle hooks run
    oncreate(vnode) {
        this.path = vnode.attrs.path;
        client.read(this.path).then(contents => {
            monacoLoaded.then(monaco => {
                const editor = monaco.editor.create(this.root.dom, {
                    value: contents,
                    language: 'javascript',
                    theme: 'vs-dark'
                });
                this.editor = editor;
                window.addEventListener('resize', () => editor.layout());

                // helper function for resolving words
                // model.getWordAtPosition() treats - as a word boundary, which isn't so in CSS classes
                this.editor.getWordAt = (pos) => {
                    const model = editor.getModel();
                    const match = model.findPreviousMatch(/[ '"`.]/, pos, true, false, null, true);
                    if (!(match && match.matches)) return { word: '', range: null };

                    const { endColumn: startColumn, endLineNumber: startLineNumber } = match.range;
                    const { lineNumber: endLineNumber, column: endColumn } = pos;
                    // endColumn + 1 to grab the character just before cursor, since it gets left out by default
                    const range = { startColumn: startColumn, startLineNumber, endColumn: endColumn + 1, endLineNumber }
                    const word = model.getValueInRange(range);
                    return { word, range };
                };

                const { KeyMod, KeyCode } = monaco;

                // saving file
                this.editor.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_S, () => {
                    // must use this.path vs vnode.attrs.path
                    // I think the vnode is getting closure-captured,
                    // so the value isn't updating
                    client.write(this.path, this.editor.getValue());
                });

                // zephyr bindings
                // need to bind the path differently
                // I'm pretty sure zephyr's path won't update when this does
                const zephyrWidget = makeZephyr(editor, monaco, this.path);

                this.editor.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_E, zephyrWidget.toggle);

                this.editor.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_J, () => {
                    zephyrWidget.cycleNext();
                }, 'zephyr.isOpen');

                this.editor.addCommand(KeyMod.CtrlCmd | KeyCode.KEY_K, () => {
                    zephyrWidget.cyclePrev();
                }, 'zephyr.isOpen');

                this.editor.addCommand(KeyCode.Enter, () => {
                    zephyrWidget.accept();
                    zephyrWidget.toggle();
                }, 'zephyr.isOpen');


                const sodbIntegration = (editor, monaco, path) => {
                    let sodbDecorations = [];

                    const range = (loc) => {
                        const [start, end] = loc.split(':').slice(-2);
                        const [sline, scol] = start.split('-');
                        const [eline, ecol] = end.split('-');
                        return new monaco.Range(Number(sline), Number(scol) + 1, Number(eline), Number(ecol) + 1);
                    };

                    const exported = {
                        range,
                        filePositions: [],
                        nextFileRange(pos) {
                            // have to turn the position into a range for easy comparison
                            const currPos = monaco.Range.fromPositions(pos, pos);
                            const next = (rowRange) => {
                                const relevantPos = rowRange.getEndPosition();
                                const rowPos = monaco.Range.fromPositions(relevantPos, relevantPos);
                                return monaco.Range.compareRangesUsingStarts(rowPos, currPos) > 0;
                            };
                            let nextRange = sodb.filePositions.find(next);
                            if (!nextRange) nextRange = sodb.filePositions[0];
                            return nextRange;
                        },
                        prevFileRange(pos) {
                            // have to turn the position into a range for easy comparison
                            const currPos = monaco.Range.fromPositions(pos, pos);
                            const prev = (rowRange) => {
                                const relevantPos = rowRange.getStartPosition();
                                const rowPos = monaco.Range.fromPositions(relevantPos, relevantPos);
                                return monaco.Range.compareRangesUsingEnds(rowPos, currPos) < 0;
                            };
                            let nextRange = sodb.filePositions.slice().reverse().find(prev);
                            if (!nextRange) nextRange = sodb.filePositions[sodb.filePositions.length - 1];
                            return nextRange;
                        },
                        selectMostRecentRowAt(nextRange) {
                            const mostRecent = window.sodb_log().slice().reverse()
                                .find(({ loc }) => monaco.Range.equalsRange(range(loc), nextRange));
                            window.sodb_selected(mostRecent);
                        }
                    };

                    window.sodb_log.map(log => {
                        // track all unique ranges in the file for position-based iteration
                        const uniquePositions = {};
                        exported.filePositions = log.filter(row => {
                            if (uniquePositions[row.loc]) return false;
                            uniquePositions[row.loc] = true;
                            return true;
                        }).map(row => range(row.loc)).sort(monaco.Range.compareRangesUsingStarts);

                        // slice 1 to remove potential `.` from path
                        const newDecorations = log.filter(row => row.loc.split(':')[0].endsWith(path.slice(1)))
                            .map(row => ({
                                range: range(row.loc),
                                options: {
                                    className: 'bg-gray-eighty'
                                }
                            }));
                        sodbDecorations = editor.deltaDecorations(sodbDecorations, newDecorations);
                    });

                    return exported;
                };

                const sodb = sodbIntegration(editor, monaco, vnode.attrs.path);

                // sodb bindings
                // cycle through code positions, selecting most recent values as we go
                this.editor.addCommand(KeyMod.Alt | KeyCode.KEY_J, () => {
                    const pos = editor.getPosition();
                    const nextRange = sodb.nextFileRange(pos);
                    const nextPos = nextRange.getEndPosition();
                    editor.setPosition(nextPos);
                    editor.revealLine(nextPos.lineNumber);

                    sodb.selectMostRecentRowAt(nextRange);
                });

                this.editor.addCommand(KeyMod.Alt | KeyCode.KEY_K, () => {
                    const pos = editor.getPosition();
                    const nextRange = sodb.prevFileRange(pos);
                    const nextPos = nextRange.getStartPosition();
                    editor.setPosition(nextPos);
                    editor.revealLine(nextPos.lineNumber);

                    sodb.selectMostRecentRowAt(nextRange);
                });

                // cycle through values in log
                this.editor.addCommand(KeyMod.Alt | KeyCode.KEY_H, () => {
                    const row = window.sodb_selected();
                    if (!row) window.sodb_selected(window.sodb_log().last());
                    else window.sodb_selected(window.sodb_log().next(row));
                });

                this.editor.addCommand(KeyMod.Alt | KeyCode.KEY_L, () => {
                    const row = window.sodb_selected();
                    if (!row) window.sodb_selected(window.sodb_log().last());
                    else window.sodb_selected(window.sodb_log().prev(row));
                });

                // cycle values at same position as selected row
                this.editor.addCommand(KeyMod.Alt | KeyMod.Shift | KeyCode.KEY_J, () => {
                    const row = window.sodb_selected();
                    if (!row) window.sodb_selected(window.sodb_log().last());
                    else {
                        const log = window.sodb_log();
                        const next = log.filter(({ loc }) => loc == row.loc).next(row);
                        window.sodb_selected(next);
                    }
                });

                this.editor.addCommand(KeyMod.Alt | KeyMod.Shift | KeyCode.KEY_K, () => {
                    const row = window.sodb_selected();
                    if (!row) window.sodb_selected(window.sodb_log().last());
                    else {
                        const log = window.sodb_log();
                        const next = log.filter(({ loc }) => loc == row.loc).prev(row);
                        window.sodb_selected(next);
                    }
                });
            });
        });
    },
    view(vnode) {
        this.root = m('.hf.minh64.wf');
        return this.root;
    }
};

export default CodeEditor;

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