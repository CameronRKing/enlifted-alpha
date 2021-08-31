import Model from '../db/Model.js';
import Filter from './Filter.js';
import filters from './builtin/EnliftedFilters.js';
// user might change value
// we might change value in a new build
// when we change value, how do we detect it?
// can't call up current class and old class and compare; only get one version of code
// so, we need to cache whatever the old value was in system memory
// there should be a list of saved filters on the user's device
// when we load the app, we'll load it and look for differences between saved list and known list
// if there's an addition, we'll need to reindex all entries
// talk to Eric about how this should be done
// look for a difference between the builtin model and what we find in the datombase
class SavedFilters extends Model {
    constructor(filters) {
        super();
        this.filters = filters;
        this._id = 'saved_filters';
    }
    static async singleton() {
        // what does byId return if there's no object?
        // it should return null
        // if there's no object, we should return an empty one
        // return this.byId('saved_filters');
        // but for now, return only the built-in filters
        // saveable configuration comes later
        return filters;
    }
}
SavedFilters._attrs = [{
        jsName: "filters",
        dsName: "SavedFilters/filters",
        type: Array,
        arrayType: Filter
    }];
;
export default SavedFilters;
//# sourceMappingURL=SavedFilters.js.map