import Model from '../db/Model.js';
// transcript relies on SavedFilters
// how is that dependency expressed?
// Transcript shouldn't know anything about where the filters come from
// it just needs to know how to update its matches given a list
class Transcript extends Model {
    constructor(originalText, currentDraft, aggregates) {
        super();
        this.originalText = originalText;
        this.currentDraft = currentDraft;
        this.aggregates = aggregates;
        if (!aggregates)
            this.aggregates = {};
    }
    static create(text, filters) {
        const transcript = new Transcript(text, text, {});
        transcript.calcAggregates(filters);
        return transcript;
    }
    get totalWords() {
        return this.currentDraft.split(' ').length;
    }
    wordFreqDict() {
        return this.currentDraft.replace(/[^\w\s]/g, '').toLowerCase().split(' ')
            .filter(word => !Transcript.COMMON_WORDS.includes(word))
            .reduce((freq, word) => {
            if (!freq[word])
                freq[word] = 0;
            freq[word] = freq[word] + 1;
            return freq;
        }, {});
    }
    calcAggregates(filters) {
        this.aggregates = {};
        filters.forEach(filter => {
            const { matches } = filter.match(this.currentDraft);
            this.aggregates[filter.name] = matches.length;
        });
    }
}
Transcript._attrs = [{
        jsName: "originalText",
        dsName: "Transcript/originalText",
        type: String
    }, {
        jsName: "currentDraft",
        dsName: "Transcript/currentDraft",
        type: String
    }, {
        jsName: "aggregates",
        dsName: "Transcript/aggregates"
    }];
Transcript.COMMON_WORDS = [];
export default Transcript;
//# sourceMappingURL=Transcript.js.map