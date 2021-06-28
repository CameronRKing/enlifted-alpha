// import ResamplerWorker from './resamplerWorker';
import WorkerWrapper from './workerWrapper.js';

export default class Resampler extends WorkerWrapper {
    constructor(streamSource, onRaw, onResampled, bufferSize) {
        super(new Worker('./src/services/kaldi/resamplerWorker.js', { type: 'module' }));
        this.streamSource = streamSource;
        this.onRaw = onRaw;
        this.onResampled = onResampled;
        this.bufferSize = bufferSize;

        const { context } = this.streamSource;
        this.ready = context.audioWorklet.addModule('./src/services/kaldi/audio-interceptor.js')

        this.worker.onmessage = this.handleMessage.bind(this);
    }

    setSampleRate(targetSampleRate) {
        const { sampleRate } = this.streamSource.context;
        const conversionRatio = targetSampleRate / sampleRate;
        return this.promisify('setConversionRatio', { conversionRatio });
    }

    async start() {
        const { context } = this.streamSource;
        await this.ready;
        this.processor = new AudioWorkletNode(context, 'audio-interceptor');
        this.streamSource.connect(this.processor);
        let buf = new Float32Array(this.bufferSize);
        let pos = 0;
        this.processor.port.onmessage = ({ data }) => {
            buf.set(data, pos);
            pos += data.length;

            if (pos === this.bufferSize) {
                this.onRaw(buf);
                this.worker.postMessage({
                    command: 'resample',
                    buffer: buf,
                });

                buf = new Float32Array(this.bufferSize);
                pos = 0;
            }
        }
        this.processor.connect(context.destination);
        // this.streamSource.connect(this.processor);
        // const { context } = this.streamSource;
        // this.processor.connect(context.destination);
    }

    stop() {
        // this.streamSource.disconnect();
        this.processor.port.onmessage = null;
        this.processor.disconnect();
        return this.promisify('reset');
    }

    terminate() {
        this.stop();
        this.processor = null;

        return this.promisify('terminate');
    }

    handleMessage(msg) {
        super.handleMessage(msg);
        const { command, value } = msg.data;
        if (command === 'resample') this.onResampled(value);
    }
}
