import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
export default class CapLocalDatomSource {
    all() {
        return Storage.get({ key: 'datoms' })
            .then(({ value }) => JSON.parse(value) || []);
    }
    update(datoms) {
        return this.all().then(db => {
            datoms.forEach(datom => {
                // look for same entity id and attribute name
                const existing = db.find(da => da[0] == datom[0] && da[1] == datom[1]);
                if (existing) {
                    // update value
                    existing[2] = datom[2];
                }
                else {
                    db.push(datom);
                }
            });
            return Storage.set({
                key: 'datoms',
                value: JSON.stringify(db)
            });
        });
    }
    clear() {
        return Storage.set({ key: 'datoms', value: null });
    }
}
export const tests = (o, mq) => {
    o.spec('CapLocalDatomSource', () => {
        o('Persists and returns data', async () => {
            const src = new CapLocalDatomSource();
            await src.clear();
            o(await src.all()).looseEquals([]);
            await src.update([[1, 'name', 'Ivan']]);
            o(await src.all()).looseEquals([[1, 'name', 'Ivan']]);
        });
    });
};
//# sourceMappingURL=CapLocalDatomSource.ts.map