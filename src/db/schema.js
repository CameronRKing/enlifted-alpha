/* this file is auto-generated; do not modify by hand */
export default {
    "AudioEntry/title": {},
    "AudioEntry/audio": {
        ":db/valueType": ":db.type/ref"
    },
    "AudioEntry/transcript": {
        ":db/valueType": ":db.type/ref"
    },
    "AudioEntry/timestamps": {
        ":db/valueType": ":db.type/ref"
    },
    "AudioEntry/tags": {
        ":db/valueType": ":db.type/ref",
        ":db/cardinality": ":db.cardinality/many"
    },
    "AudioFile/file": {},
    "AudioFile/length": {},
    "AudioFile/wpm": {},
    "AudioFile/avgVol": {},
    "AudioFile/peakVol": {},
    "AudioFile/peakVolTime": {},
    "AudioFile/pauses": {
        ":db/cardinality": ":db.cardinality/many"
    },
    "Filter/name": {},
    "Filter/flow": {
        ":db/valueType": ":db.type/ref"
    },
    "Filter/intro": {},
    "Filter/list": {
        ":db/cardinality": ":db.cardinality/many"
    },
    "Filter/highlights": {},
    "Flow/name": {},
    "Flow/author": {},
    "Onboarding/initial": {},
    "SavedFilters/filters": {
        ":db/valueType": ":db.type/ref",
        ":db/cardinality": ":db.cardinality/many"
    },
    "Tag/name": {
        ":db/unique": ":db.unique/identity"
    },
    "Tag/category": {},
    "TagCategory/title": {
        ":db/unique": ":db.unique/identity"
    },
    "Simple/foo": {},
    "DirectRef/bar": {},
    "RefArray/baz": {
        ":db/cardinality": ":db.cardinality/many"
    },
    "Web/whiz": {},
    "Timestamps/createdAt": {},
    "Timestamps/lastUpdated": {},
    "Transcript/originalText": {},
    "Transcript/currentDraft": {},
    "Transcript/aggregates": {}
};
//# sourceMappingURL=schema.js.map