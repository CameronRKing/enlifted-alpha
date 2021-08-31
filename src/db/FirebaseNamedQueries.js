import firebase from '../boot/firebase.js';
import FirebaseModel from './FirebaseModel.js';
import stream from '../../_snowpack/pkg/mithril/stream.js';
export default {
    // static
    async AudioEntry_allSubscribe(AudioEntry) {
        const subscription = stream();
        AudioEntry.__db.collection('objects').where('type', '==', 'AudioEntry')
            .orderBy('AudioEntry-timestamps.Timestamps-createdAtUnix', 'desc')
            .onSnapshot(async (snapshot) => {
            const entries = await Promise.all(snapshot.docs.map(doc => {
                if (!FirebaseModel.__cache[doc.id])
                    FirebaseModel.__cache[doc.id] = AudioEntry.hydrate(doc);
                return FirebaseModel.__cache[doc.id];
            }));
            subscription(entries);
        });
        return subscription;
    },
    // static
    // not used yet; not tested
    async AudioEntry_byTag(AudioEntry, tag) {
        return null;
        const db = AudioEntry.__db;
        // if given string, we need to get tag object
        if (typeof tag === 'string')
            tag = await AudioEntry.Tag.bake(tag);
        return db.collection('objects')
            .where('AudioEntry-tags', 'array-contains', tag._id)
            .get().then(querySnapshot => {
            return Promise.all(querySnapshot.docs.map(doc => AudioEntry.hydrate(doc)));
        });
    },
    // static
    async AudioEntry_all(AudioEntry) {
        const db = AudioEntry.__db;
        return db.collection('objects').where('type', '==', 'AudioEntry').get()
            .then(querySnapshot => {
            return Promise.all(querySnapshot.docs.map(doc => AudioEntry.hydrate(doc)));
        });
    },
    // static
    async Onboarding_singleton(Onboarding) {
        return Onboarding.__db.collection('objects').where('type', '==', 'Onboarding').get()
            .then(qs => {
            if (qs.docs.length > 0)
                return Onboarding.hydrate(qs.docs[0]);
            return new Onboarding(false);
        });
    },
    // instance
    async Tag_merge(tag, newName) {
        const existing = await tag.constructor.byName(newName);
        if (!existing)
            throw new Error('Cannot merge tag; no tag with name `' + newName + '` exists.');
        const db = tag.getDb();
        const batch = db.batch();
        batch.delete(existing.doc);
        await db.collection('objects').where('AudioEntry-tags', 'array-contains', existing._id).get()
            .then(qs => {
            qs.forEach(doc => {
                batch.update(doc.ref, { 'AudioEntry-tags': firebase.firestore.FieldValue.arrayRemove(existing._id) });
                batch.update(doc.ref, { 'AudioEntry-tags': firebase.firestore.FieldValue.arrayUnion(tag._id) });
                // this would probably be a good place to update any cached objects, too
                if (FirebaseModel.__cache[doc.id])
                    FirebaseModel.__cache[doc.id].then(model => { model.tags.remove(existing); if (!model.tags.includes(tag))
                        model.tags.push(tag); });
            });
        });
        tag.name = newName;
        batch.commit();
        return tag.save();
    },
    // instance
    async Tag_delete(tag) {
        // find AudioEntry-tags array-contains tag._id
        const db = tag.getDb();
        const batch = db.batch();
        await tag.getDb().collection('objects').where('AudioEntry-tags', 'array-contains', tag._id).get()
            .then(qs => qs.docs.map(async (doc) => {
            // this would be a good place to update any cached objects that refer to the tags
            const cached = await tag.constructor.__cache[doc.id];
            if (cached) {
                cached.tags.remove(tag);
            }
            batch.update(doc.ref, { 'AudioEntry-tags': firebase.firestore.FieldValue.arrayRemove(tag._id) });
        }));
        batch.delete(tag.doc);
        return batch.commit();
    },
    // static
    async Tag_byName(Tag, name) {
        return Tag.__db.collection('objects').where('Tag-name', '==', name).get()
            .then(qs => {
            if (qs.docs.length > 0)
                return Tag.hydrate(qs.docs[0]);
            return null;
        });
    },
    // static
    async TagCategory_bake(TagCategory, name) {
        const db = TagCategory.__db;
        return db.collection('objects').where('TagCategory-title', '==', name).get()
            .then(qs => {
            if (qs.docs.length > 0)
                return TagCategory.hydrate(qs.docs[0]);
            const tagCat = new TagCategory(name);
            return tagCat.save();
        });
    },
    // instance
    async TagCategory_tags(tagCat) {
        const db = tagCat.getDb();
        return db.collection('objects').where('Tag-category', '==', tagCat._id).get()
            .then(querySnapshot => Promise.all(querySnapshot.docs.map(doc => tagCat.Tag.hydrate(doc))));
    },
    // instance
    async TagCategory_tagsWithEntryCount(tagCat) {
        const db = tagCat.getDb();
        const entryCounts = {};
        return db.collection('objects').where('Tag-category', '==', tagCat._id).get()
            .then(async (qs) => {
            const tags = await Promise.all(qs.docs.map(async (doc) => {
                const tag = await tagCat.Tag.hydrate(doc);
                const count = (await db.collection('objects').where('AudioEntry-tags', 'array-contains', tag._id).get()).docs.length;
                entryCounts[tag.name] = count;
                return tag;
            }));
            return [tags.sort((l, r) => l.name.localeCompare(r.name)), entryCounts];
        });
    }
};
//# sourceMappingURL=FirebaseNamedQueries.js.map