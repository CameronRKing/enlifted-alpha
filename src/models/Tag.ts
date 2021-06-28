var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
import Model from '@/db/Model.ts';
import TagCategory from '@/models/TagCategory.ts';
let Tag = class Tag extends Model {
    constructor(name, category) {
        super();
        this.name = name;
        this.category = category;
        if (!category)
            this.category = TagCategory.None;
    }
    async delete() {
        const db = this.getDb();
        // first, update all entries that use this tag
        const entries = db.q(`[:find [?eid ...]
            :in $ ?tagName
            :where
                [?tagId "Tag/name" ?tagName]
                [?eid "AudioEntry/tags" ?tagId]
        ]`, this.name);
        let tags = db.q(`[:find ?entries ?tags
            :in $ [?entries ...]
            :where
                [?entries "AudioEntry/tags" ?tags]]`, entries);
        tags = tags.reduce((acc, [id, tagId]) => {
            if (!acc[id])
                acc[id] = [];
            if (tagId !== this._id)
                acc[id].push({ ':db/id': tagId });
            return acc;
        }, {});
        const retractions = entries.map(id => [':db/retract', id, 'AudioEntry/tags']);
        const restatements = entries.map(id => ({ ':db/id': id, 'AudioEntry/tags': tags[id] }));
        await db.transact(retractions, false);
        await db.transact(restatements);
        await db.transact([[':db/retractEntity', this._id]]);
    }
    static byName(name, db) {
        const res = db.q(`[:find ?id
            :in $ ?name
            :where [?id "Tag/name" ?name]
        ]`, name);
        if (!res.length)
            return null;
        return Tag.byId(res[0]);
    }
    // returns finds existing tag or creates & saves new tag
    static async bake(name, db) {
        db = db || Model.__db;
        const existing = Tag.byName(name, db);
        if (existing)
            return existing;
        const tag = new Tag(name, TagCategory.None);
        tag._db = db;
        await tag.save();
        return tag;
    }
    // like bake, but doesn't save new tags
    // the name isn't descriptive, but:
    // (1) I didn't want to complicate the signature of bake() with optional params
    // (2) you come up with a name that isn't half a sentence
    // findOrMake vs. findOrCreate?
    static fry(name, db) {
        db = db || Model.__db;
        const existing = Tag.byName(name, db);
        if (existing)
            return existing;
        const tag = new Tag(name, TagCategory.None);
        tag._db = db;
        return tag;
    }
};
Tag._attrs = [{
        jsName: "name",
        dsName: "Tag/name",
        type: String
    }, {
        jsName: "category",
        dsName: "Tag/category",
        type: TagCategory
    }];
Tag.NAME_MAX_LENGTH = 25;
Tag = __decorate([
    __param(0, Model.identity),
    __metadata("design:paramtypes", [String, typeof (_a = typeof TagCategory !== "undefined" && TagCategory) === "function" ? _a : Object])
], Tag);
;
export default Tag;
//# sourceMappingURL=Tag.ts.map