import Model from '../db/Model.js';
import Flow from './Flow.js';
class Filter extends Model {
    constructor(name, flow, intro, list, highlights) {
        super();
        this.name = name;
        this.flow = flow;
        this.intro = intro;
        this.list = list;
        this.highlights = highlights;
    }
    match(text) {
        const matches = [];
        // all non-characters are optional
        const allWords = this.list.map(word => word.replace(/([^a-zA-Z])/g, '$1?'));
        const regex = new RegExp('\\b(' + allWords.join('|') + ')\\b', 'gi');
        const iter = text.matchAll(regex);
        let match = iter.next();
        const originalWords = this.list.reduce((acc, word) => ({ ...acc, [word.toLowerCase().replace(/[^a-z]/, '')]: word }), {});
        let counts = this.list.reduce((acc, word) => ({ ...acc, [word.toLowerCase().replace(/[^a-z]/, '')]: 0 }), {});
        while (!match.done) {
            let { 0: text, index: start } = match.value;
            const end = start + text.length;
            // remove symbols and normalize case so we can count the number of like words,
            // regardless of their specific form
            const word = text.toLowerCase().replace(/[^a-z]/, '');
            if (!counts[word])
                counts[word] = 0;
            counts[word] = counts[word] + 1;
            matches.push({
                start,
                end,
                word,
                text,
                filter: this
            });
            match = iter.next();
        }
        // rename the entries in counts
        counts = Object.entries(counts).reduce((acc, [key, val]) => ({ ...acc, [originalWords[key]]: val }), {});
        return { matches, counts };
    }
}
Filter._attrs = [{
        jsName: "name",
        dsName: "Filter/name",
        type: String
    }, {
        jsName: "flow",
        dsName: "Filter/flow",
        type: Flow
    }, {
        jsName: "intro",
        dsName: "Filter/intro",
        type: String
    }, {
        jsName: "list",
        dsName: "Filter/list",
        type: Array,
        arrayType: String
    }, {
        jsName: "highlights",
        dsName: "Filter/highlights"
    }];
;
export default Filter;
//# sourceMappingURL=Filter.js.map