import Model from '@/db/Model.ts';
import Flow from '@/models/Flow.ts';
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
        const allWords = this.list.map(word => word.replace(/([^a-zA-Z])/g, '$1?')).join('|');
        const regex = new RegExp('\\b(' + allWords + ')\\b', 'gi');
        const iter = text.matchAll(regex);
        let match = iter.next();
        while (!match.done) {
            let { 0: text, index: start } = match.value;
            const end = start + text.length;
            // remove symbols and normalize case so we can count the number of like words,
            // regardless of their specific form
            const word = text.toLowerCase().replace(/[^a-z]/, '');
            matches.push({
                start,
                end,
                word,
                text,
                filter: this
            });
            match = iter.next();
        }
        return matches;
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
//# sourceMappingURL=Filter.ts.map