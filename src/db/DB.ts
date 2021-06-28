import d from 'datascript';
import schema from './schema.ts';
export class Datom {
    constructor(entityId, attributeId, value, transactionId) {
        this.entityId = entityId;
        this.attributeId = attributeId;
        this.value = value;
        this.transactionId = transactionId;
    }
    // turns the datom from an object into an array
    toForm() {
        const form = [this.entityId, this.attributeId, this.value];
        if (this.transactionId)
            form.push(this.transactionId);
        return form;
    }
}
export class DB {
    constructor(datomSource) {
        this.datomSource = datomSource;
        this.d = d;
        this.readyPromise = this.datomSource.all().then(datoms => {
            this.db = d.init_db(datoms, schema);
        });
    }
    ready() {
        return this.readyPromise;
    }
    q(query, values) {
        if (values) {
            return d.q(query, this.db, values);
        }
        else {
            return d.q(query, this.db);
        }
    }
    async transact(datoms, saveAfter = true) {
        const report = d.transact(d.conn_from_db(this.db), datoms);
        this.db = report.db_after;
        const forms = report.tx_data.map(({ e, a, v, tx }) => [e, a, v, tx]);
        if (saveAfter)
            await this.datomSource.update(forms);
        return report;
    }
    pull(pattern, eid) {
        return d.pull(this.db, pattern, eid);
    }
    entity(id) {
        return d.entity(this.db, id);
    }
    dump() {
        return d.datoms(this.db, ':eavt');
    }
}
export const tests = (o, mq) => {
    const datomSourceMock = {
        all() {
            return Promise.resolve([
                [1, 'journal_title', 'Work'],
            ]);
        },
        update(datoms) {
            return Promise.resolve();
        },
        clear() {
            return Promise.resolve();
        }
    };
    o.spec('DB', () => {
        o('calls the datom source with updates on transactions', async () => {
            const db = new DB(datomSourceMock);
            await db.ready();
            const oldFn = datomSourceMock.update;
            const update = o.spy(oldFn);
            datomSourceMock.update = update;
            await db.transact([[":db/add", -1, "name", "Ivan"]]);
            o(update.callCount).equals(1);
            o(update.args[0].length).equals(1);
            o(update.args[0]).looseEquals([[2, 'name', 'Ivan']]);
            datomSourceMock.update = oldFn;
        });
        o('initializes a database for queries', async () => {
            const db = new DB(datomSourceMock);
            await db.ready();
            const res = db.q(`[:find ?e :where [?e "journal_title" "Work"]]`);
            o(res.length).equals(1);
            o(res[0][0]).equals(1);
        });
    });
};
//# sourceMappingURL=DB.ts.map