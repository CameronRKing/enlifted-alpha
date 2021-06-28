import Model from '@/db/Model.ts';
class Onboarding extends Model {
    constructor(initial) {
        super();
        this.initial = initial;
    }
    static async singleton() {
        const id = Model.__db.q(`[:find ?eid . :where [?eid "Onboarding/initial"]]`);
        if (!id) {
            return Promise.resolve(new Onboarding(false));
        }
        else {
            return Promise.resolve(Onboarding.byId(id));
        }
    }
}
Onboarding._attrs = [{
        jsName: "initial",
        dsName: "Onboarding/initial",
        type: Boolean
    }];
;
export default Onboarding;
//# sourceMappingURL=Onboarding.ts.map