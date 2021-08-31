import * as __SNOWPACK_ENV__ from '../../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

const __cmps__ = {};
import AudioCapture from './index.m.js';
import m from '../../../../_snowpack/pkg/mithril.js';
import stream from '../../../../_snowpack/pkg/mithril/stream.js';
import { DB } from '../../../db/DB.js';
import Memory from '../../../db/MemoryDatomSource.js';
import AudioEntry from '../../../models/AudioEntry.js';

const makeCtx = () => {
    const ds = new Memory();
    const db = new DB(ds);
    const _hiddenCtx = {
        ds,
        db,
        audioInput: {
            handlers: { meter: [] },
            startRecord(filename) { },
            stopRecord() { },
            addListener(name, cb) {
                const handlers = _hiddenCtx.audioInput.handlers[name] || [];
                handlers.push(cb);
                _hiddenCtx.audioInput.handlers[name] = handlers;

                return { remove: () => handlers.splice(handlers.indexOf(cb), 1) };
            },
        },
        fs: { deleteFile({ path, directory }) { } },
    };
    return _hiddenCtx;
};

let isRunning = false;
export let states = {
    base: m.cmp({
        localCtx: makeCtx(),
        finish() { },
        view: function base(vnode) {
            this.sync(vnode, ["ctx"]);
            return m(AudioCapture, {
                ctx: this.ctx,
                "ctx": Object.assign(Object.assign({}, this.ctx), this.localCtx),
                "onfinish": this.finish.bind(this),
                "prompt": m("div", {}, [`Let it out`]),
                "helper": m("div", {}, [`Suggested time: 2 minutes`])
            }, []);
        }
    }, (cmp) => __cmps__['base'] = cmp),
    running: m.cmp({
        localCtx: makeCtx(),
        finish() { },
        view: function running(vnode) {
            this.sync(vnode, ["ctx"]);
            return (() => { this["audio"] = m(AudioCapture, {
                ctx: this.ctx,
                "ctx": Object.assign(Object.assign({}, this.ctx), this.localCtx),
                "onfinish": this.ßfinish,
                "prompt": m("div", {}, [`Let it out`]),
                "helper": m("div", {}, [`Suggested time: 2 minutes`])
            }, []); return this["audio"]; })();
        },
        setup(vnode) {
            this.sync(vnode, ["ctx"]);
            if (isRunning) return;
            stream.every(112).map(
                () => this.localCtx.audioInput.handlers['meter'].forEach(cb => {
                    const avgDb = Date.now() % 100 - 90;
                    const rms = 'doesnt matter';
                    const peakPCM = 'doesnt matter';
                    cb({ avgDb, rms, peakPCM })
                })
            );
            isRunning = true;
        },
        oncreate() {
            this.audio.state.toggle();
        }
    }, (cmp) => __cmps__['running'] = cmp)
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export let tests = (o, mq) => {
    o.spec('AudioCapture', () => {
        let cmp;

        const contains = (selector, text) => {
            const str = cmp.first(selector).innerHTML;
            o(str.includes(text)).equals(true, `${selector} contents '${str}' should include '${text}'.`)
        };

        const notContains = (selector, text) => {
            const str = cmp.first(selector).innerHTML;
            o(str.includes(text)).equals(false, `${selector} contents '${str}' should not include '${text}'.`);
        }

        o('Starts recording', async () => {
            cmp = mq(states.base);

            window.mq = cmp;
            const startRecord = o.spy();
            states.base.localCtx.audioInput.startRecord = startRecord;
            contains('[data-mq="toggle"]', 'Resume');
            cmp.should.have('[data-mq="redo"]');
            cmp.should.have('[data-mq="finish"]');


            cmp.click('[data-mq="toggle"]')

            await wait(5);
            cmp.redraw();

            notContains('[data-mq="toggle"]', 'Resume');

            cmp.should.not.have('[data-mq="redo"]');
            cmp.should.not.have('[data-mq="finish"]');

            o(startRecord.callCount).equals(1);
            states.base.localCtx.audioInput.startRecord = () => { };

            cmp.onremove();
        });

        o('Pauses input', async () => {
            cmp = mq(states.running);

            // what's the best way to inject a spy into the context?
            const stopRecord = o.spy(() => Promise.resolve());
            states.running.localCtx.audioInput.stopRecord = stopRecord;

            await wait(5);
            cmp.redraw();

            notContains('[data-mq="toggle"]', 'Resume');
            cmp.click('[data-mq="toggle"]')

            await wait(5);
            cmp.redraw();

            contains('[data-mq="toggle"]', 'Resume');

            cmp.should.have('[data-mq="redo"]');
            cmp.should.have('[data-mq="finish"]');

            o(stopRecord.callCount).equals(1);
            states.running.localCtx.audioInput.stopRecord = () => { };
        });

        o('Resets the entry state', () => {
            cmp = mq(states.base);

            const del = o.spy();
            // I want a more semantic API for spying/setting component context
            // that's probably coming out of mithril-query
            // since I'm redefining what components are,
            // it makes sense to redefine their testing interface
            states.base.localCtx.fs.deleteFile = del;

            cmp.click('[data-mq="redo"]')

            o(del.callCount).equals(1);
            states.base.localCtx.fs.deleteFile = () => { };
        });

        o('Finishes the entry', async () => {
            // it'd make more sense to spy on the method on the living component, rather than the blueprint
            const finish = o.spy();
            states.base.finish = finish;

            cmp = mq(states.base);

            states.base.localCtx.ds.clear();

            cmp.click('[data-mq="finish"]')

            await finish.untilCalled();

            o(finish.callCount).equals(1);
            o(finish.args.length).equals(1);

            const entry = finish.args[0];
            o(entry._id).notEquals(undefined);
            o(entry._id).notEquals(null);

            o(await AudioEntry.byId(entry._id, states.base.localCtx.db)).notEquals(undefined);

            states.base.localCtx.ds.clear();

            // move spy cleanup inside ospec
            states.base.finish = () => { }
        });
    });
}
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