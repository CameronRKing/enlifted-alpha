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
var Tag_1, _a;
import Model, { instanceQueries, staticQueries } from '../db/Model.js';
import TagCategory, { NoneReady } from './TagCategory.js';
let Tag = Tag_1 = class Tag extends Model {
    constructor(name, category) {
        super();
        this.name = name;
        this.category = category;
        if (!category)
            this.category = TagCategory.None;
    }
    // returns finds existing tag or creates & saves new tag
    static async bake(name, db) {
        db = db || Model.__db;
        const existing = await Tag_1.byName(name, db);
        if (existing)
            return existing;
        await NoneReady;
        const tag = new Tag_1(name, TagCategory.None);
        tag._db = db;
        await tag.save();
        return tag;
    }
    // like bake, but doesn't save new tags
    // the name isn't descriptive, but:
    // (1) I didn't want to complicate the signature of bake() with optional params
    // (2) you come up with a name that isn't half a sentence
    // findOrMake vs. findOrCreate?
    static async fry(name, db) {
        db = db || Model.__db;
        const existing = await Tag_1.byName(name, db);
        if (existing)
            return existing;
        await NoneReady;
        const tag = new Tag_1(name, TagCategory.None);
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
Tag = Tag_1 = __decorate([
    instanceQueries(['delete', 'merge']),
    staticQueries(['byName']),
    __param(0, Model.identity),
    __metadata("design:paramtypes", [String, typeof (_a = typeof TagCategory !== "undefined" && TagCategory) === "function" ? _a : Object])
], Tag);
;
export default Tag;
//# sourceMappingURL=Tag.js.map