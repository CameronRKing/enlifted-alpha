import Model from '@/db/Model.ts';
import { DateTime } from 'luxon';
class Timestamps extends Model {
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
        return Timestamps.format(this.createdAt);
    }
    formatLastUpdated() {
        return Timestamps.format(this.lastUpdated);
    }
    dehydrateThis(defaultDehydrator) {
        // the unix attributes aren't really part of the model
        // they're included here for ease of querying in the database
        return {
            'Timestamps/createdAt': this.createdAt.toObject(),
            'Timestamps/lastUpdated': this.lastUpdated.toObject(),
            'Timestamps/createdAtUnix': this.createdAt.toMillis(),
            'Timestamps/lastUpdatedUnix': this.lastUpdated.toMillis()
        };
    }
    static hydrateThis(entity) {
        return new Timestamps(DateTime.fromMillis(entity.get('Timestamps/createdAtUnix')), DateTime.fromMillis(entity.get('Timestamps/lastUpdatedUnix')));
    }
    static create(createdAt) {
        return new Timestamps(createdAt, createdAt);
    }
}
Timestamps._attrs = [{
        jsName: "createdAt",
        dsName: "Timestamps/createdAt",
        type: DateTime
    }, {
        jsName: "lastUpdated",
        dsName: "Timestamps/lastUpdated",
        type: DateTime
    }];
;
export default Timestamps;
//# sourceMappingURL=Timestamps.ts.map