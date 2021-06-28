import Model from '@/db/Model.ts';
class Flow extends Model {
    constructor(name, author) {
        super();
        this.name = name;
        this.author = author;
    }
}
Flow._attrs = [{
        jsName: "name",
        dsName: "Flow/name",
        type: String
    }, {
        jsName: "author",
        dsName: "Flow/author",
        type: String
    }];
;
export default Flow;
//# sourceMappingURL=Flow.ts.map