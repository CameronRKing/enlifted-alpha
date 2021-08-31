var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
import Model, { staticQueries } from '../db/Model.js';
import AudioFile from './AudioFile.js';
import Transcript from './Transcript.js';
import Timestamps from './Timestamps.js';
import Tag from './Tag.js';
import { Duration, DateTime } from '../../_snowpack/pkg/luxon.js';
import { DB } from '../db/DB.js';
let AudioEntry = class AudioEntry extends Model {
    constructor(title, audio, transcript, timestamps, tags) {
        super();
        this.title = title;
        this.audio = audio;
        this.transcript = transcript;
        this.timestamps = timestamps;
        this.tags = tags;
    }
};
AudioEntry._attrs = [{
        jsName: "title",
        dsName: "AudioEntry/title",
        type: String
    }, {
        jsName: "audio",
        dsName: "AudioEntry/audio",
        type: AudioFile
    }, {
        jsName: "transcript",
        dsName: "AudioEntry/transcript",
        type: Transcript
    }, {
        jsName: "timestamps",
        dsName: "AudioEntry/timestamps",
        type: Timestamps
    }, {
        jsName: "tags",
        dsName: "AudioEntry/tags",
        type: Array,
        arrayType: Tag
    }];
AudioEntry.TITLE_MAX_LENGTH = 50;
AudioEntry = __decorate([
    staticQueries(['all', 'byTag', 'allSubscribe']),
    __metadata("design:paramtypes", [String, typeof (_a = typeof AudioFile !== "undefined" && AudioFile) === "function" ? _a : Object, typeof (_b = typeof Transcript !== "undefined" && Transcript) === "function" ? _b : Object, typeof (_c = typeof Timestamps !== "undefined" && Timestamps) === "function" ? _c : Object, typeof (_d = typeof Array !== "undefined" && Array) === "function" ? _d : Object])
], AudioEntry);
window.ae = AudioEntry;
export default AudioEntry;
import tags from './builtin/DefaultTags.js';
import Memory from '../db/MemoryDatomSource.js';
const ipsum = `Don't do that, little Timmy! You might hurt yourself! I really don't like how you always get into trouble. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam purus dolor, ultrices at diam ut, hendrerit mattis mi. Morbi nunc risus, sollicitudin non blandit at, semper vehicula metus. Nunc in rhoncus erat, mollis accumsan eros. Maecenas scelerisque, lectus a finibus porta, dui orci efficitur justo, non rhoncus mauris nibh sit amet eros. Sed velit odio, tincidunt sed libero at, gravida lacinia ex. Fusce lectus justo, dictum at sem eu, bibendum tincidunt mi. Aliquam erat volutpat. Sed nisi diam, accumsan et lobortis vitae, semper et orci. Duis venenatis vel mauris id auctor. Phasellus quis gravida dolor.`;
export const fakes = {
    lorem: new AudioEntry(ipsum.slice(0, 50), new AudioFile('example.wav', Duration.fromObject({ minutes: 0, seconds: 13 }), 180, 57, 70, Duration.fromObject({ minutes: 0, seconds: 6 }), [] // pauses
    ), Transcript.create(ipsum, []), Timestamps.create(DateTime.local()), [tags[0], tags[1], tags[2]])
};
export let tests = (o, mq) => {
    let db;
    const fake = async (attrs) => {
        const peaks = [];
        for (let ii = 1; ii <= 50; ii++) {
            peaks.push(ii * 2);
        }
        const entry = new AudioEntry('', new AudioFile('', {}, 0, 0, 0, {}, peaks, []), Transcript.create('', []), Timestamps.create(DateTime.local()), []);
        Object.assign(entry, attrs);
        entry._db = db;
        await entry.save();
        return entry;
    };
    o.beforeEach(async () => {
        db = new DB(new Memory());
        await db.ready();
        window.db = db;
        Model.__db = db;
    });
    o.spec('AudioEntry', () => {
        o('finds entries containing a given tag', async () => {
            const Work = new Tag('work');
            const Health = new Tag('health');
            const first = await fake({ title: 'First', tags: [Work] });
            const second = await fake({ title: 'Second', tags: [Health] });
            let matches;
            matches = await AudioEntry.byTag('work', db);
            o(matches.length).equals(1);
            o(first._id).notEquals(undefined);
            o(matches[0]._id).equals(first._id);
            matches = await AudioEntry.byTag(Health, db);
            o(matches.length).equals(1);
            console.log(matches[0]);
            o(matches[0]._id).equals(second._id);
        });
    });
};
//# sourceMappingURL=AudioEntry.js.map