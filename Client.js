import io from './_snowpack/pkg/socket.io-client.js';

let socket;
export default () => {
    if (!socket) socket = io('https://localhost:4242');

    const emit = (name, args) => new Promise(resolve => socket.emit(name, args, resolve));
    return {
        read(path) {
            return emit('read', path);
        },
        write(path, contents) {
            return emit('write', { path, contents });
        },
        onStates(cb) {
            socket.on('states-available', cb);
        },
        switchDir(dir) {
            return emit('switch-dir', dir);
        }
    };
}