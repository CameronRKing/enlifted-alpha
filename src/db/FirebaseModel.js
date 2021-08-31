import firebase, { isFirestoreOnline, dbReady } from '../boot/firebase.js';
import namedQueries from './FirebaseNamedQueries.js';
import Attachment from './Attachment.js';
export default class FirebaseModel {
    constructor() {
        this._inline = false;
        this._id = undefined;
    }
    /* parameter decorator; marks the attribute as db/unique: db.unique/identity */
    static identity() { }
    ;
    /* class decorator; marks a class as being stored as JSON rather than as a separate entity */
    static inline(constructor) {
        constructor._inline = true;
    }
    ;
    static registerBridge(AttachmentKind, bridge) {
        this.attachmentBridges.set(AttachmentKind, bridge);
    }
    static lookupBridge(AttachmentKind) {
        const bridge = this.attachmentBridges.get(AttachmentKind);
        if (!bridge)
            throw new Error(`No bridge found for type ${AttachmentKind.name}; remember to call Model.registerBridge(AttachmentKind, bridge).`);
        return bridge;
    }
    get _id() {
        return this.__id;
    }
    set _id(val) {
        this.__id = val;
    }
    get doc() {
        if (!this._doc) {
            if (this._id)
                this._doc = this.getDb().collection('objects').doc(this._id);
            else
                this._doc = this.getDb().collection('objects').doc();
        }
        return this._doc;
    }
    static ready() {
        return dbReady;
    }
    getDb() {
        return this._db || FirebaseModel.__db;
    }
    async save() {
        const db = this.getDb();
        const batch = db.batch();
        const [docs, attachments] = this.dehydrate();
        docs.forEach(([doc, pojo]) => {
            batch.set(doc, pojo);
        });
        if (!FirebaseModel.__cache[this._id]) {
            FirebaseModel.__cache[this._id] = Promise.resolve(this);
        }
        // the promise won't ever resolve if we're offline
        // it will, however, actually run (roughly synchronously, I assume)
        const promise = Promise.all([...attachments.map(attach => attach.save()), batch.commit()]).then(() => this);
        return isFirestoreOnline() ? promise : this;
    }
    static isArrayOfRefs(attr) {
        return attr.type === Array && attr.arrayType && attr.arrayType.prototype instanceof FirebaseModel;
    }
    dehydrate() {
        const allObjects = [];
        const attachments = [];
        const dehydrateObj = (obj) => {
            let rawData;
            if (typeof obj.dehydrateThis === 'function') {
                rawData = obj.dehydrateThis(dehydrateObj);
            }
            // Otherwise it's recursive dehydration based on constructor arguments
            else {
                rawData = obj.constructor._attrs.map(attr => {
                    // perhaps I should move the dehydration/hydration override to attributes?
                    let val = obj[attr.jsName];
                    // recursively dehydrate refs/arrays of refs
                    if (typeof obj[`dehydrate_${attr.jsName}`] === 'function') {
                        val = obj[`dehydrate_${attr.jsName}`]();
                    }
                    else if (val && val.constructor.prototype instanceof FirebaseModel) {
                        const id = val.doc.id;
                        // the doc and its raw data are added to the log
                        // the raw data here is replaced with a reference to the id
                        const data = dehydrateObj(val);
                        // inline objects get saved as they are; other objects are replaced by their ids
                        val = attr.type._inline ? data : id;
                    }
                    else if (FirebaseModel.isArrayOfRefs(attr)) {
                        const ids = val.map(obj => obj.doc.id);
                        val.map(dehydrateObj);
                        val = ids;
                    }
                    else if (val && attr.type === Attachment) {
                        attachments.push(val);
                        val = { id: val._id, type: val.constructor.name };
                    }
                    return { [attr.dsName.replace('/', '-')]: val };
                }).reduce((acc, obj) => Object.assign(acc, obj), {});
            }
            rawData.type = obj.constructor.name;
            if (!obj.constructor._inline)
                allObjects.push([obj.doc, rawData]);
            obj._id = obj.doc.id;
            return rawData;
        };
        dehydrateObj(this);
        return [allObjects, attachments];
    }
    static async byId(id) {
        const objs = await this.fetch(id);
        return Array.isArray(objs) ? objs.map(obj => this.hydrate(obj)) : this.hydrate(objs);
    }
    static async fetch(id) {
        const db = FirebaseModel.__db;
        if (Array.isArray(id)) {
            if (id.length === 0)
                return [];
            const batches = [];
            // Firebase Cloud Firestore has a 10-limit max on their query 'in' operator,
            // which is the only way to resolve multiple documents by id
            for (let idx = 0; idx < id.length; idx += 10) {
                batches.push(id.slice(idx, idx + 10));
            }
            const toReturn = [];
            const notFound = [];
            await Promise.all(batches.map(ids => {
                return db.collection('objects').where(firebase.firestore.FieldPath.documentId(), 'in', ids).get()
                    .then(querySnapshot => {
                    querySnapshot.forEach(doc => {
                        if (!doc.exists) {
                            notFound.push(doc.id);
                            return;
                        }
                        toReturn.push(doc);
                    });
                });
            }));
            if (notFound.length)
                throw new Error(`Ids ${notFound.join(', ')} not found in Firebase.`);
            return toReturn;
        }
        return db.collection('objects').doc(id).get()
            .then(doc => {
            if (!doc.exists)
                throw new Error(`Object with id '${id}' does not exist in Firebase.`);
            return doc;
        });
    }
    static async hydrate(doc) {
        const hydrateModel = async (doc, type) => {
            if (FirebaseModel.__cache[doc.id])
                return FirebaseModel.__cache[doc.id];
            let resolveObject;
            FirebaseModel.__cache[doc.id] = new Promise(resolve => resolveObject = resolve);
            let toReturn;
            const obj = doc.data();
            // models can implement custom hydration logic via Class.hydrateThis(entity)
            if (type.hasOwnProperty('hydrateThis')) {
                toReturn = type.hydrateThis(obj);
            }
            else {
                toReturn = await hydrateData(obj, type);
            }
            toReturn._id = doc.id;
            resolveObject(toReturn);
            return toReturn;
        };
        const hydrateData = async (obj, type) => {
            const toHydrate = {};
            const inline = [];
            if (type.hasOwnProperty('hydrateThis'))
                return type.hydrateThis(obj);
            const args = type._attrs.map(attr => {
                if (obj === null)
                    debugger;
                let val = obj[attr.dsName.replace('/', '-')];
                if (typeof type[`hydrate_${attr.jsName}`] === 'function') {
                    val = type[`hydrate_${attr.jsName}`](val);
                }
                else if (val && attr.type && attr.type.prototype instanceof FirebaseModel) {
                    // the args are built synchronously
                    // a placeholder is replaced later when the id is hydrated into a snapshot
                    if (attr.type._inline) {
                        const placeholder = {};
                        const oldVal = val;
                        inline.push(async () => args.replace(placeholder, await hydrateData(oldVal, attr.type)));
                        val = placeholder;
                    }
                    else {
                        const placeHolder = {};
                        toHydrate[val] = async (childDoc) => args.replace(placeHolder, await hydrateModel(childDoc, attr.type));
                        val = placeHolder;
                    }
                }
                else if (attr.arrayType && attr.arrayType.prototype instanceof FirebaseModel) {
                    const arr = [];
                    val.forEach(id => toHydrate[id] = async (childDoc) => arr.push(await hydrateModel(childDoc, attr.arrayType)));
                    val = arr;
                }
                else if (val && attr.type === Attachment) {
                    // val is an attachment id (different from entity id);
                    // the attachment type is responsible for its own async CRUD operations
                    val = new (Attachment.lookup(val.type))(val.id);
                }
                return val;
            });
            // fetch all related objects and put into place
            const ids = Object.keys(toHydrate);
            const docs = await this.fetch(ids);
            await Promise.all(inline.map(fn => fn()));
            await Promise.all(docs.map(doc => toHydrate[doc.id](doc)));
            // now that the data is arranged, finally create the actual object
            return new type(...args);
        };
        return hydrateModel(doc, this);
    }
}
FirebaseModel.namedQueries = namedQueries;
// populated class-by-class at buildtime
FirebaseModel._attrs = [];
FirebaseModel.attachmentBridges = new Map();
// for reusing objects resolved from the database
// this way, changes propogate immediately between different resolution points
FirebaseModel.__cache = {};
//# sourceMappingURL=FirebaseModel.js.map