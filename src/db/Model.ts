export default class Model {
    constructor() {
        this._id = undefined;
    }
    static isArrayOfRefs(val) {
        return Array.isArray(val) && val.length && val[0].constructor.prototype instanceof Model;
    }
    static isEntity(val) {
        return val && typeof val === 'object' && typeof val.entries === 'function';
    }
    /* parameter decorator; marks the attribute as db/unique: db.unique/identity */
    static identity() { }
    getDb() {
        return this._db || Model.__db;
    }
    dehydrate() {
        let tempId = -1;
        let nextId = () => tempId--;
        const tempIds = {};
        const data = [];
        // db.cardinality/many attributes can't be reset in a single move
        // simply setting the value ADDS to the collection, leaving old members in place
        // so we have to run the save() in two steps:
        // first, remove all known db.cardinality/many attributes
        // then save the new attributes
        const retractions = [];
        const dehydrateObj = (obj) => {
            let rawData;
            // models can choose how they get serialized (dehydrated) via object.dehydrateThis(defaultDehydrator)
            // the default dehydrator is passed in so clients can recursively dehydrate
            // their own properties, and any new objects there will have correct tempIds
            if (typeof obj.dehydrateThis === 'function') {
                rawData = obj.dehydrateThis(dehydrateObj);
            }
            // Otherwise it's recursive dehydration based on constructor arguments
            else {
                rawData = obj.constructor._attrs.map(attr => {
                    let val = obj[attr.jsName];
                    // recursively dehydrate refs/arrays of refs
                    if (val && val.constructor.prototype instanceof Model) {
                        val = dehydrateObj(val);
                    }
                    else if (Model.isArrayOfRefs(val)) {
                        val = val.map(dehydrateObj);
                    }
                    if (attr.type === Array && obj._id && obj._id > 0) {
                        retractions.push([':db/retract', obj._id, attr.dsName]);
                    }
                    return { [attr.dsName]: val };
                }).reduce((acc, obj) => Object.assign(acc, obj), {});
            }
            // we take care of ids behind the scenes
            if (obj._id)
                rawData[':db/id'] = obj._id;
            else {
                const id = nextId();
                tempIds[id] = obj;
                rawData[':db/id'] = id;
                // temporarily set id, so that if the object appears again in the graph,
                // it doesn't get duplicated
                obj._id = id;
                //
                // at least, that's what I thought I was doing
                // somehow, the _id setting is getting out of sync,
                // and objects are persisting their temporary ids after the transaction
            }
            // to persist nested models,
            // they must be flattened into a single list
            // and cross-referenced by id
            data.push(rawData);
            return { ':db/id': rawData[':db/id'] };
        };
        dehydrateObj(this);
        return { data, tempIds, retractions };
    }
    static hydrate(entity) {
        const hydrateModel = (obj, type) => {
            let toReturn;
            // models can implement custom hydration logic via Class.hydrateThis(entity)
            if (type.hasOwnProperty('hydrateThis')) {
                toReturn = type.hydrateThis(obj);
            }
            // otherwise it's simple plug-and-play based on the names of constructor arguments
            // (while recursively rehydrating models)
            else {
                const args = type._attrs.map(attr => {
                    let val = obj.get(attr.dsName);
                    if (val && attr.type && attr.type.prototype instanceof Model) {
                        val = hydrateModel(val, attr.type);
                    }
                    else if (attr.arrayType) {
                        val = val ? val.map(entity => hydrateModel(entity, attr.arrayType)) : [];
                    }
                    else if (attr.type === Array) {
                        // arrayType means its a model; otherwise its whatever
                        val = val ? val.map(vval => {
                            return Model.isEntity(vval) ? Model.unpackEntity(vval) : vval;
                        }) : [];
                    }
                    else if (Model.isEntity(val)) {
                        val = Model.unpackEntity(val);
                    }
                    return val;
                });
                toReturn = new type(...args);
            }
            toReturn._id = obj.get(':db/id');
            return toReturn;
        };
        return hydrateModel(entity, this);
    }
    // when I pass an object into datascript and ask for it back from an entity,
    // the interface returns another entity, not the actual object
    // so, we'll rebuild the JS object from the keys
    static unpackEntity(entity) {
        const iter = entity.entries();
        const toReturn = {};
        let entry = iter.next();
        while (!entry.done) {
            const { value } = entry;
            // according to JS, 'value is not iterable', so destructuring fails
            // const [key, val] = value;
            toReturn[value[0]] = value[1];
            entry = iter.next();
        }
        return toReturn;
    }
    async save() {
        const db = this.getDb();
        const { data, tempIds, retractions } = this.dehydrate();
        await db.transact(retractions, false);
        const report = await db.transact(data);
        // new objects learn their identities
        Object.entries(tempIds).forEach(([tempId, obj]) => {
            obj._id = report.tempids[tempId];
        });
        return this;
    }
    static byId(id, db) {
        if (!db)
            db = this.__db;
        const makeEntity = (eid) => {
            const entity = db.entity(eid);
            return entity ? this.hydrate(entity) : null;
        };
        if (Array.isArray(id)) {
            return id.map(makeEntity);
        }
        return makeEntity(id);
    }
}
// attributes are set directly on the class at build-time 
Model._attrs = [];
window.Model = Model;
//# sourceMappingURL=Model.ts.map