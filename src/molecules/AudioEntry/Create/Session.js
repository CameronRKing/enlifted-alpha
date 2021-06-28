import Entry from '../../../models/AudioEntry.ts.proxy.js';
import Transcript from '../../../models/Transcript.ts.proxy.js';
import AudioFile from '../../../models/AudioFile.ts.proxy.js';
import Timestamps from '../../../models/Timestamps.ts.proxy.js';
import SavedFilters from '../../../models/SavedFilters.ts.proxy.js';
import AudioConfig from '../../../models/builtin/AudioConfig.ts.proxy.js';
import { DateTime, Duration } from '../../../../_snowpack/pkg/luxon.js';

class PauseTracker {
    static MIN_PAUSE_LENGTH_IN_MS = 3000;
    static MAX_PAUSE_VOL_IN_DB = 30;

    isTracking = false;
    pauses = [];

    track(db) {
        if (db < PauseTracker.MAX_PAUSE_VOL_IN_DB) {
            if (!this.isTracking) this.start();
        } else if (this.isTracking) {
            this.stop();
        }
    }

    start() {
        this.isTracking = true;
        this.pauses.push(Date.now());
    }

    stop() {
        const start = this.pauses.pop();
        const end = Date.now();
        if (end - start >= PauseTracker.MIN_PAUSE_LENGTH_IN_MS) this.pauses.push({ start, end });
        this.isTracking = false;
    }

    popLast() {
        this.pauses.pop();
        this.isTracking = false;
    }

    // if a pause lasts longer than five minutes, stop the recording
    isPastCutoff() {
        return this.isTracking && Date.now() - this.pauses.last() > 5 * 60 * 1000
    }
}

export default class Session {
    startTimestamp = DateTime.local();
    endTimestamp = DateTime.local();
    isRecording = false;
    resultText = '';
    audioStats = { avgVolume: 0, maxVolume: 0, maxVolTime: { minutes: 0, seconds: 0 } };
    maxVol = { db: 0, timestamp: { minutes: 0, seconds: 0 } };
    peaks = [];
    pauseTracker = new PauseTracker();
    listeners = [];
    // injected service
    audioInput = null;

    get filename() {
        return this.startTimestamp + '.wav';
    }

    constructor(audioInput) {
        this.audioInput = audioInput;

        const ml = this.audioInput.addListener('meter', this.meterListener.bind(this));
        this.listeners.push(ml);

        this.audioInput.addListener('results', ({ text }) => console.log('intermediate results', text));

        // this event will get fired when stopRecord() is called
        const dl = this.audioInput.addListener('done', this.doneListener.bind(this));
        this.listeners.push(dl);
    }

    meterListener({ avgDb, rms, peakPCM }) {
        const realDb = AudioConfig.deviceDbToActual(avgDb);
        if (realDb > this.maxVol.db) {
            this.maxVol.db = realDb;
            this.maxVol.timestamp = DateTime.local();
        }
        this.pauseTracker.track(realDb);
        this.peaks.push(realDb);
        if (this.pauseTracker.isPastCutoff()) {
            this.toggle();
        }
        m.redraw();
    }

    doneListener({ text }) {
        this.resultText = text;
        const maxVolTime = this.maxVol.timestamp.diff(this.startTimestamp, ['minutes', 'seconds', 'milliseconds']);
        const maxVolume = Math.floor(this.maxVol.db);
        const avgVolume = Math.floor(this.peaks.reduce((acc, peak) => acc + peak, 0) / this.peaks.length);
        this.audioStats = {
            maxVolume,
            avgVolume,
            maxVolTime
        };
    }

    teardown() {
        if (this.isRecording) this.toggle();
        this.listeners.forEach(cb => cb.remove());
    }

    restart() {
        // I'm unsure whether the directory should be hidden/assumed
        // you know, I'd like to hid this from here
        this.audioInput.restart(this.filename);
        this.peaks = [];
    }

    async toggle() {
        if (this.isRecording) {
            await this.audioInput.stopRecord();
            this.endTimestamp = DateTime.local();
            // pauses leading up to the finish are ignored
            if (this.pauseTracker.isTracking) this.pauseTracker.popLast();
        } else {
            this.startTimestamp = DateTime.local();
            await this.audioInput.startRecord({ filename: this.filename });
        }

        this.isRecording = !this.isRecording;
    }

    async finish() {
        const transcript = Transcript.create(this.resultText, await SavedFilters.singleton());

        const length = this.endTimestamp.diff(this.startTimestamp, ['minutes', 'seconds']);
        const ms = this.endTimestamp.diff(this.startTimestamp);
        const lengthInMin = ms / 1000 / 60;
        // wpm is an awkward metric, since it relies on both audio and text,
        // so it belongs to neither object outright.
        // makes sense to keep it with the other metrics in AudioFile.
        const wpm = Math.floor(transcript.totalWords / lengthInMin);

        const entry = new Entry(
            // use first 50 characters of transcript as title
            transcript.currentDraft.slice(0, 50),
            new AudioFile(
                await this.audioInput.getAudioBuffer(),
                length,
                wpm,
                this.audioStats.avgVolume,
                this.audioStats.maxVolume,
                this.audioStats.maxVolTime,
                this.pauseTracker.pauses
            ),
            transcript,
            Timestamps.create(this.startTimestamp),
            [] // tags: to be set later in the process
        );

        // assume Model.__db set by context
        await entry.save();

        this.audioInput.restart();

        return entry;
    }
}