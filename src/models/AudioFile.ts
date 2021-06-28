import Model from '@/db/Model.ts';
import { Duration } from 'luxon';
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
    dehydrateThis(dehydrate) {
        console.log(this.peakVolTime);
        return {
            'AudioFile/file': this.file,
            'AudioFile/length': this.length.toObject(),
            'AudioFile/wpm': this.wpm,
            'AudioFile/avgVol': this.avgVol,
            'AudioFile/peakVol': this.peakVol,
            'AudioFile/peakVolTime': this.peakVolTime.toObject(),
            'AudioFile/pauses': this.pauses
        };
    }
    static hydrateThis(entity) {
        // when moving from QuickEntry detail page to home screen,
        // the Durations aren't getting unpacked before they get here
        // I have no idea why
        let length = entity.get('AudioFile/length');
        if (Model.isEntity(length))
            length = Model.unpackEntity(length);
        let peak = entity.get('AudioFile/peakVolTime');
        if (Model.isEntity(peak))
            peak = Model.unpackEntity(peak);
        return new AudioFile(entity.get('AudioFile/file'), Duration.fromObject(length), entity.get('AudioFile/wpm'), entity.get('AudioFile/avgVol'), entity.get('AudioFile/peakVol'), Duration.fromObject(peak), entity.get('AudioFile/pauses'));
    }
}
AudioFile._attrs = [{
        jsName: "file",
        dsName: "AudioFile/file"
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
//# sourceMappingURL=AudioFile.ts.map