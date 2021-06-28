// Sets work by object identity
// the same Tag may be reified by several different objects
// so we track identity by name for semantic cohesion
export default class TagSet {
    constructor(tags) {
        this.tags = new Set(tags);
    }

    toArray() {
        return Array.from(this.tags.values());
    }

    find(tag) {
        return this.toArray().find(match => match.name === tag.name);
    }

    has(tag) {
        return this.find(tag) !== undefined;
    }

    add(tag) {
        if (this.has(tag)) return;
        this.tags.add(tag);
        return this;
    }

    delete(tag) {
        if (!this.has(tag)) return;
        // can't use the given object, since it may not share identity with the one in the set
        this.tags.delete(this.find(tag));
        return this;
    }

    toggle(tag) {
        this.has(tag) ? this.delete(tag) : this.add(tag);
        return this;
    }
}