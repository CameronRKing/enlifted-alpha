import { openDB } from 'idb';
import Model from './Model.ts';
export default class IdbDatomSource {
    constructor() {
        this.db = null;
    }
    async getDb() {
        if (this.db)
            return this.db;
        this.db = await openDB('datoms', 1, {
            upgrade(db) {
                db.createObjectStore('datoms');
            }
        });
        return this.db;
    }
    async all() {
        return (await this.getDb()).getAll('datoms');
    }
    async update(datoms) {
        const db = await this.getDb();
        const tx = db.transaction('datoms', 'readwrite');
        return Promise.all([
            ...datoms.map(datom => {
                // datascript will convert POJOs to their custom format
                // best to convert back for storage
                if (Model.isEntity(datom[2])) {
                    datom[2] = Model.unpackEntity(datom[2]);
                }
                // entity_id-attribute_name for our unique key
                return tx.store.put(datom, `${datom[0]}-${datom[1]}`);
            }),
            tx.done
        ]).then(() => { });
    }
    clear() {
        return this.getDb().then(db => db.clear('datoms'));
    }
}
export const tests = (o, mq) => {
    o.spec('IdbDatomSource', () => {
        o('Persists and returns data', async () => {
            const src = new CapLocalDatomSource();
            await src.clear();
            o(await src.all()).looseEquals([]);
            await src.update([[1, 'name', 'Ivan']]);
            o(await src.all()).looseEquals([[1, 'name', 'Ivan']]);
        });
    });
};
//# sourceMappingURL=IdbDatomSource.ts.map