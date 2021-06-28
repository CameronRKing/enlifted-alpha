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
import Model from '@/db/Model.ts';
import Tag from '@/models/Tag.ts';
let TagCategory = class TagCategory extends Model {
    constructor(title) {
        super();
        this.title = title;
    }
    /*
        The complexity in this method is due to the design requirements for tag display.
        Tags are sorted by most recently used.
        Tags that aren't used are sorted alphabetically and appended to list.
    */
    tags() {
        const all = this.getDb().q(`
        [:find ?tagId ?name
            :in $ ?tagCatTitle
            :where
                [?tagCat "TagCategory/title" ?tagCatTitle]
                [?tagId "Tag/category" ?tagCat]
                [?tagId "Tag/name" ?name]
        ]`, this.title);
        const inUse = this.getDb().q(`
        [:find ?tagId (max ?timestamp)
            :in $ ?tagCatTitle
            :where
                [?tagCat "TagCategory/title" ?tagCatTitle]
                [?tagId "Tag/category" ?tagCat]
                [?aeId "AudioEntry/tags" ?tagId]
                [?aeId "AudioEntry/timestamps" ?tsId]
                [?tsId "Timestamps/createdAtUnix" ?timestamp]
        ]`, this.title);
        const inUseIds = inUse.sort((l, r) => l[1] - r[1])
            .map(([id, timestamp]) => id);
        const remainingIds = all.filter(([id]) => !inUseIds.includes(id))
            .sort((l, r) => l[1].localeCompare(r[1]))
            .map(([id, name]) => id);
        return [...Tag.byId(inUseIds), ...Tag.byId(remainingIds)];
    }
    // not a fan of the minorly specialized method,
    // but neither do I want queries in client code
    tagsWithEntryCount() {
        const all = this.getDb().q(`
        [:find [?tagId ...]
            :in $ ?tagCatTitle
            :where
                [?tagCat "TagCategory/title" ?tagCatTitle]
                [?tagId "Tag/category" ?tagCat]
        ]`, this.title);
        let inUse = this.getDb().q(`
        [:find ?tagId (count ?aeId)
            :in $ ?tagCatTitle
            :where
                [?tagCat "TagCategory/title" ?tagCatTitle]
                [?tagId "Tag/category" ?tagCat]
                [?aeId "AudioEntry/tags" ?tagId]
        ]`, this.title);
        inUse = inUse.reduce((acc, [id, count]) => {
            acc[id] = count;
            return acc;
        }, {});
        const tags = Tag.byId(all);
        const entryCounts = tags.reduce((acc, tag, idx) => {
            acc[tag.name] = inUse[tag._id] || 0;
            return acc;
        }, {});
        tags.sort((l, r) => l.name.localeCompare(r.name));
        return [tags, entryCounts];
    }
};
TagCategory._attrs = [{
        jsName: "title",
        dsName: "TagCategory/title",
        type: String
    }];
TagCategory.None = undefined; // set in models/builtin/DefaultTags.ts
TagCategory = __decorate([
    __param(0, Model.identity),
    __metadata("design:paramtypes", [String])
], TagCategory);
;
export default TagCategory;
//# sourceMappingURL=TagCategory.ts.map