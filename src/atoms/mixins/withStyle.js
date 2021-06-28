import families from '../../theme/css-utils.css.js.js';

const classToFamily = Object.entries(families).reduce((acc, [name, family]) => {
    Object.keys(family).forEach(cclass => {
        acc[cclass] = name;
    });
    return acc;
}, {});

const areSiblings = (l, r) => classToFamily[l] === classToFamily[r];

// ideally, this mixin would also declare the style prop,
// but the $props API design is gonna take some time,
// so I'm putting it off for now.
export default (state, baseStyle, propName='style') => {
    return () => {
        const baseClasses = baseStyle.split(' ');
        const givenClasses = state[propName] ? state[propName].split(' ') : [];
        const notOverridden = baseClasses.filter(cclass => {
            const hasSibling = givenClasses.some(given => areSiblings(cclass, given));
            return !hasSibling;
        })
        return [...givenClasses, ...notOverridden].join(' ')
    }
}