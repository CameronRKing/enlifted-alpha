import Model from '../db/Model.js';
import Attachment from '../db/Attachment.js';
import { Duration } from '../../_snowpack/pkg/luxon.js';
class AudioFile extends Model {
    constructor(file, length, wpm, avgVol, peakVol, peakVolTime, pauses) {
        super();
        this.file = file;
        this.length = length;
        this.wpm = wpm;
        this.avgVol = avgVol;
        this.peakVol = peakVol;
        this.peakVolTime = peakVolTime;
        this.pauses = pauses;
    }
    get url() {
        return this.file.url();
    }
    dehydrate_length() {
        return this.length.toObject();
    }
    dehydrate_peakVolTime() {
        return this.peakVolTime.toObject();
    }
    static hydrate_length(val) {
        return Duration.fromObject(val);
    }
    static hydrate_peakVolTime(val) {
        return Duration.fromObject(val);
    }
}
AudioFile._attrs = [{
        jsName: "file",
        dsName: "AudioFile/file",
        type: Attachment
    }, {
        jsName: "length",
        dsName: "AudioFile/length",
        type: Duration
    }, {
        jsName: "wpm",
        dsName: "AudioFile/wpm",
        type: Number
    }, {
        jsName: "avgVol",
        dsName: "AudioFile/avgVol",
        type: Number
    }, {
        jsName: "peakVol",
        dsName: "AudioFile/peakVol",
        type: Number
    }, {
        jsName: "peakVolTime",
        dsName: "AudioFile/peakVolTime",
        type: Duration
    }, {
        jsName: "pauses",
        dsName: "AudioFile/pauses",
        type: Array
    }];
export default AudioFile;
//# sourceMappingURL=AudioFile.js.map