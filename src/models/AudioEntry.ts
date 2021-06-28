import Model from '@/db/Model.ts';
import AudioFile from '@/models/AudioFile.ts';
import Transcript from '@/models/Transcript.ts';
import Timestamps from '@/models/Timestamps.ts';
import Tag from '@/models/Tag.ts';
import { Duration, DateTime } from 'luxon';
import { DB } from '@/db/DB.ts';
class AudioEntry extends Model {
    constructor(title, audio, transcript, timestamps, tags) {
        super();
        this.title = title;
        this.audio = audio;
        this.transcript = transcript;
        this.timestamps = timestamps;
        this.tags = tags;
    }
    static byTag(tag, db) {
        db = db || Model.__db;
        const res = db.q(`[:find [?e ...]
            :in $ ?tagName
            :where
                [?tagId "Tag/name" ?tagName]
                [?e "AudioEntry/tags" ?tagId] 
        ]`, typeof tag === 'string' ? tag : tag.name);
        return AudioEntry.byId(res, db);
    }
    static all(db) {
        db = db || Model.__db;
        const res = db.q(`[:find ?e ?ts
            :where
                [?e "AudioEntry/timestamps" ?te]
                [?te "Timestamps/createdAtUnix" ?ts]
        ]`);
        // [?time "Timestamps/createdAtUnix" ?ts]
        // sort from most recent to oldest
        res.sort((l, r) => l[1] - r[1]);
        return AudioEntry.byId(res.map(rr => rr[0]), db);
    }
}
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
window.ae = AudioEntry;
export default AudioEntry;
import tags from '@/models/builtin/DefaultTags.ts';
import Memory from '@/db/MemoryDatomSource.ts';
const ipsum = `Don't do that, little Timmy! You might hurt yourself! I really don't like how you always get into trouble. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam purus dolor, ultrices at diam ut, hendrerit mattis mi. Morbi nunc risus, sollicitudin non blandit at, semper vehicula metus. Nunc in rhoncus erat, mollis accumsan eros. Maecenas scelerisque, lectus a finibus porta, dui orci efficitur justo, non rhoncus mauris nibh sit amet eros. Sed velit odio, tincidunt sed libero at, gravida lacinia ex. Fusce lectus justo, dictum at sem eu, bibendum tincidunt mi. Aliquam erat volutpat. Sed nisi diam, accumsan et lobortis vitae, semper et orci. Duis venenatis vel mauris id auctor. Phasellus quis gravida dolor.`;
export const fakes = {
    lorem: new AudioEntry(ipsum.slice(0, 50), new AudioFile('example.wav', Duration.fromObject({ minutes: 0, seconds: 13 }), 180, 57, 70, Duration.fromObject({ minutes: 0, seconds: 6 }), [] // pauses
    ), Transcript.create(ipsum, []), Timestamps.create(DateTime.local()), [tags[0], tags[1], tags[2]])
};
export const tests = (o, mq) => {
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
//# sourceMappingURL=AudioEntry.ts.map