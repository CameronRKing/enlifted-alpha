import FirebaseModel from './FirebaseModel.js';
export { FirebaseModel };
// decorators for linking Model classes to complex lookups and updates
export function instanceQueries(names) {
    return (constructor) => {
        names.forEach(name => constructor.prototype[name] = function (...args) {
            args.unshift(this);
            return constructor.namedQueries[`${constructor.name}_${name}`](...args);
        });
    };
}
export function staticQueries(names) {
    return (constructor) => {
        names.forEach(name => constructor[name] = function (...args) {
            args.unshift(constructor);
            return constructor.namedQueries[`${constructor.name}_${name}`](...args);
        });
    };
}
// import Model from './DataScriptModel.ts';
// export default Model;
const Model = FirebaseModel;
export default Model;
window.Model = Model;
//# sourceMappingURL=Model.js.map