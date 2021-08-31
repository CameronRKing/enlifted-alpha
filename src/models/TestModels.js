import { FirebaseModel } from '../db/Model.js';
export class Simple extends FirebaseModel {
    constructor(foo) {
        super();
        this.foo = foo;
    }
}
Simple._attrs = [{
        jsName: "foo",
        dsName: "Simple/foo",
        type: String
    }];
export class DirectRef extends FirebaseModel {
    constructor(bar) {
        super();
        this.bar = bar;
    }
}
DirectRef._attrs = [{
        jsName: "bar",
        dsName: "DirectRef/bar",
        type: Simple
    }];
export class RefArray extends FirebaseModel {
    constructor(baz) {
        super();
        this.baz = baz;
    }
}
RefArray._attrs = [{
        jsName: "baz",
        dsName: "RefArray/baz",
        type: Array,
        arrayType: Simple
    }];
export class Web extends FirebaseModel {
    constructor(whiz) {
        super();
        this.whiz = whiz;
    }
}
Web._attrs = [{
        jsName: "whiz",
        dsName: "Web/whiz",
        type: RefArray
    }];
//# sourceMappingURL=TestModels.js.map