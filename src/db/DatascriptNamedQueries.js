// the first argument to static queries is the host class
// the first argument to instance queries is the host object
export default {
    // static
    async AudioEntry_byTag(AudioEntry, tag) {
        const db = AudioEntry.__db;
        const res = db.q(`[:find [?e ...]
            :in $ ?tagName
            :where
                [?tagId "Tag/name" ?tagName]
                [?e "AudioEntry/tags" ?tagId] 
        ]`, typeof tag === 'string' ? tag : tag.name);
        return AudioEntry.byId(res, db);
    },
    // static
    async AudioEntry_all(AudioEntry) {
        const db = AudioEntry.__db;
        const res = db.q(`[:find ?e ?ts
            :where
                [?e "AudioEntry/timestamps" ?te]
                [?te "Timestamps/createdAtUnix" ?ts]
        ]`);
        // sort from most recent to oldest
        res.sort((l, r) => r[1] - l[1]);
        return AudioEntry.byId(res.map(rr => rr[0]), db);
    },
    // static
    async Onboarding_singleton(Onboarding) {
        const id = Onboarding.__db.q(`[:find ?eid . :where [?eid "Onboarding/initial"]]`);
        if (!id) {
            return new Onboarding(false);
        }
        else {
            return Onboarding.byId(id);
        }
    },
    // instance
    async Tag_delete(tag) {
        const db = tag.getDb();
        // first, update all entries that use this tag
        const entries = db.q(`[:find [?eid ...]
            :in $ ?tagName
            :where
                [?tagId "Tag/name" ?tagName]
                [?eid "AudioEntry/tags" ?tagId]
        ]`, tag.name);
        let tags = db.q(`[:find ?entries ?tags
            :in $ [?entries ...]
            :where
                [?entries "AudioEntry/tags" ?tags]]`, entries);
        tags = tags.reduce((acc, [id, tagId]) => {
            if (!acc[id])
                acc[id] = [];
            if (tagId !== tag._id)
                acc[id].push({ ':db/id': tagId });
            return acc;
        }, {});
        const retractions = entries.map(id => [':db/retract', id, 'AudioEntry/tags']);
        const restatements = entries.map(id => ({ ':db/id': id, 'AudioEntry/tags': tags[id] }));
        await db.transact(retractions, false);
        await db.transact(restatements);
        await db.transact([[':db/retractEntity', tag._id]]);
    },
    // static
    async Tag_byName(Tag, name) {
        const db = Tag.__db;
        const res = db.q(`[:find ?id .
            :in $ ?name
            :where [?id "Tag/name" ?name]
        ]`, name);
        if (!res)
            return null;
        return Tag.byId(res);
    },
    // instance
    async TagCategory_tags(tagCat) {
        const all = tagCat.getDb().q(`
        [:find ?tagId ?name
            :in $ ?tagCatTitle
            :where
                [?tagCat "TagCategory/title" ?tagCatTitle]
                [?tagId "Tag/category" ?tagCat]
                [?tagId "Tag/name" ?name]
        ]`, tagCat.title);
        const inUse = tagCat.getDb().q(`
        [:find ?tagId (max ?timestamp)
            :in $ ?tagCatTitle
            :where
                [?tagCat "TagCategory/title" ?tagCatTitle]
                [?tagId "Tag/category" ?tagCat]
                [?aeId "AudioEntry/tags" ?tagId]
                [?aeId "AudioEntry/timestamps" ?tsId]
                [?tsId "Timestamps/createdAtUnix" ?timestamp]
        ]`, tagCat.title);
        const inUseIds = inUse.sort((l, r) => l[1] - r[1])
            .map(([id, timestamp]) => id);
        const remainingIds = all.filter(([id]) => !inUseIds.includes(id))
            .sort((l, r) => l[1].localeCompare(r[1]))
            .map(([id, name]) => id);
        return [...tagCat.Tag.byId(inUseIds), ...tagCat.Tag.byId(remainingIds)];
    },
    // instance
    async TagCategory_tagsWithEntryCount(tagCat) {
        const all = tagCat.getDb().q(`
        [:find [?tagId ...]
            :in $ ?tagCatTitle
            :where
                [?tagCat "TagCategory/title" ?tagCatTitle]
                [?tagId "Tag/category" ?tagCat]
        ]`, tagCat.title);
        let inUse = tagCat.getDb().q(`
        [:find ?tagId (count ?aeId)
            :in $ ?tagCatTitle
            :where
                [?tagCat "TagCategory/title" ?tagCatTitle]
                [?tagId "Tag/category" ?tagCat]
                [?aeId "AudioEntry/tags" ?tagId]
        ]`, tagCat.title);
        inUse = inUse.reduce((acc, [id, count]) => {
            acc[id] = count;
            return acc;
        }, {});
        const tags = tagCat.Tag.byId(all);
        const entryCounts = tags.reduce((acc, tag, idx) => {
            acc[tag.name] = inUse[tag._id] || 0;
            return acc;
        }, {});
        tags.sort((l, r) => l.name.localeCompare(r.name));
        return [tags, entryCounts];
    }
};
//# sourceMappingURL=DatascriptNamedQueries.js.map