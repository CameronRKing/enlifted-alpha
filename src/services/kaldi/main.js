import loadModel from './loadModel.js';
import ASRHandler from './asrHandler.js';
import ResamplerHandler from './resamplerHandler.js';
import toWav from '../../../_snowpack/pkg/audiobuffer-to-wav.js';
import stream from '../../../_snowpack/pkg/mithril/stream.js';

import { WebPlugin } from '../../../_snowpack/pkg/@capacitor/core.js';
class KaldiTranscriber extends WebPlugin {
    static BUFFER_SIZE = 4096; // ~ 90ms @ 44.1khz

    prevTranscript = '';
    fullTranscript = '';
    chunks = [];

    constructor(modelName) {
        super({
            name: 'Kaldi',
            platforms: ['web'],
        });
        // loading the ASR engine takes 17 seconds.
        // for speed of dev, it makes sense to turn it off when not in use
        this.withAsr = true;

        this.asrHandler = new ASRHandler();
        this.resamplerHandler = null;      
        this.loader = this.initLoader();
        
        const shortName = modelName.split('/').slice(-1)[0].split('.')[0];
        if (this.withAsr)
            this.ready = new Promise((resolve, reject) => {
                loadModel(modelName)
                    .then(buf => this.asrHandler.init(shortName, buf))
                    .then(() => this.loader.end(true))
                    .then(resolve)
                    .catch(reject);
            });
        else
            this.ready = Promise.resolve(true);
    }

    // a stream so clients can track roughly how close the model is to ready-state
    initLoader() {
        const loader = stream();
        const estimatedTime = 16000;
        const poll = 100;
        let timePassed = 0;
        let interval = setInterval(() => {
            timePassed += poll;
            if (timePassed >= estimatedTime) clearInterval(interval);
            loader(timePassed / estimatedTime * 100);
        }, poll);
        return loader;
    }

    requestPermissions() {
        return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    }

    destroy() {
        if (this.withAsr) this.asrHandler.terminate();
        this.resamplerHandler.terminate();
    }

    onaudio(buf) {
        this.chunks.push(buf);

        const avgAmplitude = buf.reduce((acc, val) => acc + Math.abs(val), 0) / buf.length;
        const avgDb = 20 * Math.log10(avgAmplitude);
        
        this.notifyListeners('meter', { avgDb });
    }
    
    onsample(buf) {
        if (!this.withAsr) return;
        this.asrHandler.process(buf).then(transcript => this.updateTranscript(transcript));        
    }

    async startRecord() {
        if (!this.resamplerHandler) {
            await this.requestPermissions()
                .then((stream) => {
                    this.chunks = [];
                    this.context = new AudioContext();
                    const audioSource = this.context.createMediaStreamSource(stream);
                    this.resamplerHandler = new ResamplerHandler(
                        audioSource,
                        this.onaudio.bind(this),
                        this.onsample.bind(this),
                        KaldiTranscriber.BUFFER_SIZE
                    );
                });
        }
        
        this.ready.then(() => this.withAsr ? this.asrHandler.getSampleRate() : Promise.resolve(16000))
            .then((asrSR) => this.resamplerHandler.setSampleRate(asrSR))
            .then(() => this.resamplerHandler.start())
    }

    stopRecord() {
        this.resamplerHandler.stop();
        if (this.withAsr) this.asrHandler.reset();
        else this.notifyListeners('done', { text: 'lorem ipsum' })
    }

    getAudioBuffer() {
        const len = this.chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const buf = this.context.createBuffer(1, len, this.context.sampleRate)

        let pos = 0;
        this.chunks.forEach(chunk => {
            buf.copyToChannel(chunk, 0, pos);
            pos += chunk.length;
        });

        // this returns an ArrayBuffer, which can't be used directly
        return toWav(buf, { float32: true });
    }

    restart() {
        this.chunks = [];
        this.fullTranscript = '';
        this.prevTranscript = '';
    }

    updateTranscript(transcript) {
        if (transcript === null) return;

        const { text, isFinal } = transcript;

        if (text === '' && this.prevTranscript !== '') {
            this.fullTranscript += ' ' + this.prevTranscript;
        }
        this.prevTranscript = text;

        this.notifyListeners(isFinal ? 'done' : 'results', { text: (this.fullTranscript + ' ' + text).trim() });
    }
}

import { registerWebPlugin } from '../../../_snowpack/pkg/@capacitor/core.js';
registerWebPlugin(new KaldiTranscriber('/src/services/kaldi/english_small.zip'));

import { Plugins } from '../../../_snowpack/pkg/@capacitor/core.js';
const { Kaldi } = Plugins;
export default Kaldi;
