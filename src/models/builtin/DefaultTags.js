import Tag from '../Tag.js';
// this file assumes Model.__db has been set elsewhere
// we use .fry rather than .bake so that we can synchronously return the Tag objects,
// and save them async (user can check for save if needed)
const tags = ['Work', 'Family', 'Health', 'Relationships', 'Money', 'School', 'Friends', 'Dreams', 'Achievement'];
const tagsFried = Promise.all(tags.map(async (name, idx) => tags[idx] = await Tag.fry(name)));
// mmm ... where does this run?
// how can I trigger it to run only once in production, but many times in dev?
// batch save would be nice, but requires heavy refactoring of Model.dehydrate()
export const save = () => tagsFried.then(tags => tags.reduce((done, tag) => {
    return done.then(() => {
        if (tag._id)
            return Promise.resolve();
        if (!tag.save)
            console.log(tag);
        return tag.save();
    });
}, Promise.resolve()));
export default tags;
//# sourceMappingURL=DefaultTags.js.map