import { WebPlugin } from '../../_snowpack/pkg/@capacitor/core.js';
// import TranscribeService from '@/services/TranscribeServiceInterface.ts';
import toWav from '../../_snowpack/pkg/audiobuffer-to-wav.js';
import { BufferAttachment } from '../db/Attachment.js';
// I don't know why, but some snowpack lines
// aren't getting added to this file at buildtime
import * as __SNOWPACK_ENV__ from '../../_snowpack/env.js';

let prefix = '';
if (__SNOWPACK_ENV__ && __SNOWPACK_ENV__.MODE === 'production') {
    prefix = '/enlifted-alpha';
}

class BrowserTranscribe extends WebPlugin {
    static TIMESLICE = 100; // in milliseconds; how often the dataavailable event is fired
    static BUFFER_SIZE = 4096;
    chunks = [];
    audioBuffer = null;
    ctx = null;
    recorder = null;
    recog = null;
    audioSrc = null;
    doneFired = false;
    ready = null;
    transcriptChunks = [];

    constructor() {
        super({
            name: 'BrowserTranscribe',
            platforms: ['web'],
        });
    }

    available() {
        return Promise.resolve(!!(webkitSpeechRecognition || SpeechRecognition))
    }

    requestPermissions() {
        return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    }

    startRecord() {
        if (this.recorder && this.recorder.state === 'recording') throw new Error('Already recording.');

        return this.requestPermissions()
            .then(async stream => {
                this.ctx = new AudioContext();
                await this.initProcessor(this.ctx, stream);
                // this.initRecorder(stream);
                this.initRecog();
                // this.recorder.start(BrowserTranscribe.TIMESLICE);
                this.recog.start();
                return true;
            });
    }

    stopRecord() {
        this.ctx.suspend();
        // this.recorder.stop();
        this.recog.stop();
        // console.log('firing done on stop gesture', { text: this.fullTranscript() });
        this.notifyListeners('done', { text: this.fullTranscript() });
        return Promise.resolve(true);
    }

    async getAudio() {
        const len = this.chunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate)

        let pos = 0;
        this.chunks.forEach(chunk => {
            buf.copyToChannel(chunk, 0, pos);
            pos += chunk.length;
        });

        return new BufferAttachment(Date.now(), toWav(buf, { float32: true }));
    }

    // clears out old data that may linger from a previous session
    // init() is more semantic than restart() at that point,
    // and they may have different definitions in different implementations
    init() {
        return this.restart();
    }

    restart() {
        this.chunks = [];
        this.transcriptChunks = [];
        this.doneFired = false;
        return Promise.resolve(true);
    }

    async initProcessor(ctx, stream) {
        const src = this.audioSrc = ctx.createMediaStreamSource(stream);
        await ctx.audioWorklet.addModule(`.${prefix}/src/services/audio-interceptor.js`);
        const processor = new AudioWorkletNode(ctx, 'audio-interceptor');
        src.connect(processor);
        let buf = new Float32Array(BrowserTranscribe.BUFFER_SIZE);
        let pos = 0;
        processor.port.onmessage = ({ data }) => {
            buf.set(data, pos);
            pos += data.length;

            // in practice, the given buffer has a size of 128,
            // and will add up precisely to our BUFFER_SIZE,
            // but I imagine it might not always have a 2^x length,
            // so we do a safer check
            if (pos >= BrowserTranscribe.BUFFER_SIZE) {
                const avgAmplitude = buf.reduce((acc, val) => acc + Math.abs(val), 0) / buf.length;
                const avgDb = 20 * Math.log10(avgAmplitude);
                this.notifyListeners('meter', { avgDb });

                this.chunks.push(buf);
                buf = new Float32Array(BrowserTranscribe.BUFFER_SIZE);
                pos = 0;
            }
        }
        processor.connect(ctx.destination);
    }

    // deprecated; kept for reference
    initRecorder(stream) {
        this.recorder = new MediaRecorder(stream);

        this.recorder.addEventListener('dataavailable', async (e) => {
            if (e.data.size > 0) {
                this.chunks.push(e.data);
                // the given data is encoded, so it doesn't contain PCM numbers,
                // which we need to calculate decibels correctly
                const buf = new Int8Array(await e.data.arrayBuffer());
                // this.ctx.decodeAudioData(buf, audio => {
                //     const buf = audio.getChannelData(0);
                const avgAmplitude = buf.reduce((acc, val) => acc + Math.abs(val), 0) / buf.length;
                const avgDb = 20 * Math.log10(avgAmplitude) - 90; // -90 for legacy reasons; will be added back later
                this.notifyListeners('meter', { avgDb });
                // });
            }
        });

        this.recorder.addEventListener('stop', async () => {
            const blob = new Blob(this.chunks);
            this.audioBuffer = await blob.arrayBuffer();
        });
    }

    initRecog() {
        this.recog = new (webkitSpeechRecognition || SpeechRecognition)();
        this.recog.lang = 'en-US';
        // the docs don't adequately explain what these two flags do,
        // or how continuous results are delivered (in chunks? in a single, growing string?)
        this.recog.continuous = true;
        this.recog.interimResults = false;
        this.recog.maxAlternatives = 1;

        this.recog.onresult = (evt) => {
            const log = evt.results;

            // if we've entered a new speech session,
            // save the last transcript
            if (log.length < this.lastLogLength) {
                this.transcriptChunks.push(this.currentTranscript);
            }
            this.lastLogLength = log.length;

            let text = '';
            for (let ii = 0; ii < log.length; ii++) {
                text += ' ' + Array.from(log[ii]).map(row => row.transcript).reduce((str, trans) => `${str} ${trans}`, '');
            }
            this.currentTranscript = text;

            const event = { running: 'results', suspended: 'done' }[this.ctx.state];
            // console.log('onresult', { evt, fullTranscript: this.fullTranscript(), event });
            this.notifyListeners(event, { text: this.fullTranscript() });

        };

        // recognition auto-ends on small pauses
        // we'll keep restarting it as long as the recorder is running
        this.recog.onend = (evt) => {
            if (this.ctx.state === 'running') this.recog.start();
        }
    }

    fullTranscript() {
        return [...this.transcriptChunks, this.currentTranscript].join(' ... ').trim();
    }
}

export default new BrowserTranscribe();