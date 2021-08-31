// import ASRWorker from './asrWorker';
import WorkerWrapper from './workerWrapper.js';

export default class ASR extends WorkerWrapper {
    constructor() {
        super(new Worker('./src/services/kaldi/asrWorker.js', { type: 'module' }));
    }

    init(modelName, zip) {
        return this.promisify('init', { modelName, zip });
    }

    getSampleRate() {
        return this.promisify('samplerate');
    }

    process(pcm) {
        return this.promisify('process', { pcm });
    }

    reset(zippedModel) {
        return this.promisify('reset', { zippedModel });
    }

    terminate() {
        return this.promisify('terminate');
    }
}
