import stream from '../../../../_snowpack/pkg/mithril/stream.js';
import { Duration } from '../../../../_snowpack/pkg/luxon.js';

export default class AudioFileController {
    url = '';
    isPlaying = stream(false);
    timeRemaining = stream(Duration.fromObject({ minutes: 0, seconds: 0 }));
    audioCtx = new AudioContext();
    raw = null;
    audioData = null;
    audio = null;
    readyPromise = null;

    constructor(audioFile, url) {
        this.audioFile = audioFile;
        // url is now async
        // that complicates things a little
        this.url = url;
        this.audio = new Audio(this.url);
        this.readyPromise = Promise.all([
            new Promise(resolve => {
                // reset to beginning when done playing
                this.audio.addEventListener('ended', () => {
                    this.audio.currentTime = 0;
                    this.isPlaying(false);
                });

                this.audio.addEventListener('canplaythrough', () => {
                    this.timeRemaining(this._timeRemaining());
                    resolve();
                });
            }),
        ]);
    }

    ready() { return this.readyPromise; }

    _timeRemaining() {
        // sometimes audio.duration is Infinity, even if the audio is fully loaded
        // seems like it's a Chrome bug
        // so, we'll rely on the known length of the AudioFile
        return this._durationFromSeconds(this.audioFile.length.toMillis() / 1000 - this.audio.currentTime);
    }

    _currentTime() {
        return this._durationFromSeconds(this.audio.currentTime);
    }

    _durationFromSeconds(secs) {
        const minutes = Math.floor(secs / 60);
        const seconds = secs % 60;
        return Duration.fromObject({ minutes, seconds });
    }

    play() {
        if (this.isPlaying()) return;

        this.audio.play();

        this.audio.addEventListener('timeupdate', () => {
            this.timeRemaining(this._timeRemaining());
        });

        this.isPlaying(true);
    }

    pause() {
        if (!this.isPlaying()) return;

        this.audio.pause();
        this.isPlaying(false);
    }

    toggle() {
        this.isPlaying() ? this.pause() : this.play();
    }

    seek(timeInSeconds) {
        this.audio.currentTime = timeInSeconds;
    }

    getAudioData() {
        if (this.audioData) return Promise.resolve(this.audioData);

        return new Promise(resolve => {
            fetch(this.url)
                .then(res => res.arrayBuffer())
                .then(audioData => {
                    this.audioCtx.decodeAudioData(audioData, buffer => {
                        this.audioData = buffer.getChannelData(0);
                        resolve(this.audioData);
                    });
                });
        });
    }

    peaks(numPeaks) {
        // tried using an analyser node with the <audio> element,
        // but the buffers kept coming back with dummy data
        return this.getAudioData()
            .then(data => {
                if (numPeaks < 1) return [];
                const step = Math.floor(data.length / numPeaks);
                const peaks = [];
                for (let ii = 0; ii < data.length; ii += step) {
                    const buf = data.slice(ii, ii + step);
                    const max = buf.reduce((acc, val) => val > acc ? val : acc, -1.0);
                    peaks.push(max);
                }
                return peaks;
            });
    }
}