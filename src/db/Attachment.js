// todo: convert to class
// todo: add register(class) static method that links constructor name to instance
// todo: add lookup(name) static method that returns constructor instance for name
export default class Attachment {
    static register(type) {
        this.types[type.name] = type;
    }
    static lookup(name) {
        return this.types[name];
    }
    url() { return Promise.resolve(''); }
    // getter/setter
    data(data) { return Promise.resolve(null); }
    save() { return Promise.resolve(false); }
    delete() { return Promise.resolve(false); }
}
Attachment.types = {};
import { openDB } from '../../_snowpack/pkg/idb.js';
// this is the last piece that remains to be done!
export class BufferIdbBridge {
    constructor() {
        this.db = openDB('audiofiles', 1, {
            upgrade(db) {
                db.createObjectStore('audiofiles');
            }
        });
    }
    async get(id) {
        return (await this.db).get('audiofiles', id);
    }
    async save(attachment) {
        const id = attachment._id;
        const data = await attachment.data();
        return (await this.db).put('audiofiles', data, id);
    }
    async delete(idOrAttachment) {
        const id = idOrAttachment instanceof Attachment ? idOrAttachment._id : idOrAttachment;
        return (await this.db).delete('audiofiles', id);
    }
}
export class BufferAttachment extends Attachment {
    constructor(_id, buf) {
        super();
        this._id = _id;
        this.buf = buf;
    }
    async url() {
        return window.URL.createObjectURL(new Blob([await this.data()]));
    }
    async data(data) {
        if (data)
            this.buf = data;
        else {
            if (!this.buf)
                this.buf = await BufferAttachment.bridge.get(this._id);
            return this.buf;
        }
    }
    async save() {
        return BufferAttachment.bridge.save(this);
    }
    async delete() {
        return BufferAttachment.bridge.delete(this);
    }
}
BufferAttachment.bridge = new BufferIdbBridge();
Attachment.register(BufferAttachment);
//# sourceMappingURL=Attachment.js.map