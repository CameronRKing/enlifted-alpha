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
import Model, { instanceQueries, staticQueries } from '../db/Model.js';
import Tag from './Tag.js';
let TagCategory = class TagCategory extends Model {
    constructor(title) {
        super();
        this.title = title;
    }
    get Tag() { return Tag; }
};
TagCategory._attrs = [{
        jsName: "title",
        dsName: "TagCategory/title",
        type: String
    }];
TagCategory = __decorate([
    instanceQueries(['tags', 'tagsWithEntryCount']),
    staticQueries(['bake']),
    __param(0, Model.identity),
    __metadata("design:paramtypes", [String])
], TagCategory);
export default TagCategory;
;
export const NoneReady = TagCategory.bake('Your Tags').then(none => TagCategory.None = none);
// export default TagCategory;
//# sourceMappingURL=TagCategory.js.map