import Filter from '../Filter.js';
import Flows from './EnliftedFlows.js';
const filters = [
    new Filter('Negations', Flows.Negations, 'Negations wreck our Focus. If you’re focused on what you’d don’t want or can’t do, you’re missing out. Flip them positive to reveal hidden opportunities.', [
        `don't`,
        `can't`,
        `won't`,
        `shouldn't`,
        `haven't`,
        `not`,
        `isn't`,
        `didn't`,
        `wasn't`,
        `hasn't`,
    ], { main: 'primary-cool', text: 'white' }),
    new Filter('Soft Talk', Flows['Soft Talk'], 'Get clear and solid with your words for more powerful thinking. Eliminate soft words like: might, think, maybe, possibly, probably, try, just, kind of, feels like...', [
        `think`,
        `maybe`,
        `might`,
        `possibly`,
        `perhaps`,
        `probably`,
        `tried`,
        `try`,
        `trying`,
    ], { main: 'primary-warm', text: 'white' }),
    new Filter('Binaries', Flows.Binaries, 'Save the always, never, and forever for fairy tales. In real life, these words are rarely accurate.They close off our minds to possibilities, and can create unuseful stories or beliefs.', [
        'always',
        'never',
        'forever'
    ], { main: 'secondary-medium', text: 'white' }),
    // not necessary for now
    //
    // new Filter(
    //     'Filler Words',
    //     Flows['Filler Words'],
    //     'Intro to filler words',
    //     [
    //         'really',
    //         'just',
    //         'like',
    //         'I mean'
    //     ],
    //     { main: 'primary-medium', text: 'white' }
    // ),
];
// treat array as an object for easy lookup by name
filters.forEach(filter => filters[filter.name] = filter);
export default filters;
//# sourceMappingURL=EnliftedFilters.js.map