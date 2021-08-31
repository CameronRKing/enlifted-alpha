import Flow from '../Flow.js';
// special object: array with extra property indexes
// that way the content can be iterated in order and randomly accessed
const flows = [
    new Flow('Negations'),
    new Flow('Soft Talk'),
    new Flow('Filler Words'),
    new Flow('Binaries'),
];
flows.forEach(flow => flows[flow.name] = flow);
export default flows;
//# sourceMappingURL=EnliftedFlows.js.map