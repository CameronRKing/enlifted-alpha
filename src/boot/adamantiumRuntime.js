import m from '../../_snowpack/pkg/mithril.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';

m.componentCreated((vnode, callHook) => {
    // legacy way of implementing props
    vnode.state.sync = (vnode, ...toSync) => {
        sync(vnode.attrs, vnode.state, toSync);
        if (vnode.state && typeof vnode.state.onsync === 'function') {
            callHook.call(vnode.state.onsync, vnode);
        }
    };

    // returns a stream which contains the value at that object's key
    // and can be used to set it
    // changes to the original object don't enter the stream, currentlys
    vnode.state.$wrap = (obj, key) => {
        const str = stream(obj[key]);
        str.map(val => obj[key] = val);
        return str;
    };

    vnode.state.$sessionData = (viewName, keyName, init) => {
        const dataStream = vnode.state.ctx.session[viewName];
        const data = dataStream();
        if (!data[keyName]) {
            data[keyName] = init();
            dataStream(data);
        }
        return data[keyName];
    }
    
    runSetup(vnode, callHook);
});

// legacy way of implementing props, auto-inserted by adamantium/index.js
// extremely simple: copies over given keys
function sync(source, receiver, toSync) {
    if (!source || !receiver) return;

    // users can call this.sync('one', 'two') or this.sync(['one', 'two'])
    if (toSync.length === 1 && Array.isArray(toSync[0])) toSync = toSync[0];
    toSync.forEach(key => {
        if (receiver[key] != source[key]) {
            receiver[key] = source[key];
        }
    });
}

const runSetup = (vnode, callHook) => {
    if (typeof vnode.state.setup === 'function') {
        // run setup, capturing all created streams
        stream.intercept();
        callHook.call(vnode.state.setup, vnode);
        const captured = stream.stopIntercept();

        // auto-end created streams when component is removed
        if (captured.length) {
            if (typeof vnode.state.onremove === 'function') {
                const oldRemove = vnode.state.onremove;
                vnode.state.onremove = function (vnode) {
                    callHook.call(oldRemove, vnode);
                    captured.forEach(stream => stream.end(true));
                }
            } else {
                vnode.state.onremove = () => captured.forEach(stream => stream.end(true));
            }
        }
    }
}
