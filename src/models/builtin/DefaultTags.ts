import Tag from '@/models/Tag.ts';
import TagCategory from '@/models/TagCategory.ts';
TagCategory.None = new TagCategory('Your Tags');
// this file assumes Model.__db has been set elsewhere
// we use .fry rather than .bake so that we can synchronously return the Tag objects,
// and save them async (user can check for save if needed)
const tags = ['Work', 'Family', 'Health', 'Relationships', 'Money', 'School', 'Friends', 'Dreams', 'Achievement']
    .map(name => Tag.fry(name));
// batch save would be nice, but requires heavy refactoring of Model.dehydrate()
export const save = () => tags.reduce((done, tag) => {
    return done.then(() => {
        if (tag._id)
            return Promise.resolve();
        return tag.save();
    });
}, Promise.resolve());
export default tags;
//# sourceMappingURL=DefaultTags.ts.map