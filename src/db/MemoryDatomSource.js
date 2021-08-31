export default class MemoryDatomSource {
    constructor(datoms = []) {
        this.store = datoms;
    }
    all() {
        return Promise.resolve(this.store);
    }
    update(changes) {
        this.store = this.store.concat(changes);
        return Promise.resolve();
    }
    clear() {
        this.store = [];
        return Promise.resolve();
    }
}
//# sourceMappingURL=MemoryDatomSource.js.map