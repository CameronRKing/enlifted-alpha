var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Timestamps_1, _a, _b;
import Model from '../db/Model.js';
import { DateTime } from '../../_snowpack/pkg/luxon.js';
// so, I need to mark this as inline somehow,
// then alter the dehydrate/hydration logic to accomodate inline models
// "inline" meaning the data is saved as JSON, not as a separate entity
// (makes querying easier)
let Timestamps = Timestamps_1 = class Timestamps extends Model {
    constructor(createdAt, lastUpdated) {
        super();
        this.createdAt = createdAt;
        this.lastUpdated = lastUpdated;
    }
    static format(date) {
        // e.g., 4/20/2021 1:07am
        // designs specify that meridian ('a': am/pm) should be lowercase
        // luxon capitalizes it everywhere by default
        return date.toFormat('L/d/y h:mma').toLowerCase();
    }
    formatCreatedAt() {
        return Timestamps_1.format(this.createdAt);
    }
    formatLastUpdated() {
        return Timestamps_1.format(this.lastUpdated);
    }
    dehydrateThis(defaultDehydrator) {
        // the unix attributes aren't really part of the model
        // they're included here for ease of querying in the database
        return {
            'Timestamps-createdAt': this.createdAt.toObject(),
            'Timestamps-lastUpdated': this.lastUpdated.toObject(),
            'Timestamps-createdAtUnix': this.createdAt.toMillis(),
            'Timestamps-lastUpdatedUnix': this.lastUpdated.toMillis()
        };
    }
    static hydrateThis(entity) {
        return new Timestamps_1(DateTime.fromMillis(entity['Timestamps-createdAtUnix']), DateTime.fromMillis(entity['Timestamps-lastUpdatedUnix']));
    }
    static create(createdAt) {
        return new Timestamps_1(createdAt, createdAt);
    }
};
Timestamps._attrs = [{
        jsName: "createdAt",
        dsName: "Timestamps/createdAt",
        type: DateTime
    }, {
        jsName: "lastUpdated",
        dsName: "Timestamps/lastUpdated",
        type: DateTime
    }];
Timestamps = Timestamps_1 = __decorate([
    Model.inline,
    __metadata("design:paramtypes", [typeof (_a = typeof DateTime !== "undefined" && DateTime) === "function" ? _a : Object, typeof (_b = typeof DateTime !== "undefined" && DateTime) === "function" ? _b : Object])
], Timestamps);
;
export default Timestamps;
//# sourceMappingURL=Timestamps.js.map