// Do I use these anywhere?
Object.defineProperty(Object.prototype, 'mapWithKeys', {
    value: function(cb) {
        return Object.entries(this).reduce((acc, [key, val]) => {
            const [newKey, newVal] = cb(key, val);
            acc[newKey] = newVal;
            return acc;
        }, {});
    }
});

Object.defineProperty(Object.prototype, 'pairs', {
    value: function(cb) {
        if (cb === undefined) cb = (key, val) => [key, val];
        return Object.entries(this).map(([key, val]) => cb(key, val));
    }
});

Array.prototype.last = function() {
    return this[this.length - 1];
}

Array.prototype.next = function(item) {
    const idx = this.indexOf(item);
    if (idx === -1 || idx === this.length - 1) return this[0];
    return this[idx + 1];
}

Array.prototype.prev = function(item) {
    const idx = this.indexOf(item);
    if (idx === -1 || idx === 0) return this.last();
    return this[idx - 1];
}

Array.prototype.cycle = function(item, num) {
    let toReturn = item;
    const fn = num > 0 ? 'next' : 'prev';
    this.range(num).forEach(() => toReturn = this[fn](toReturn));
    return toReturn;
}

Array.prototype.remove = function(item) {
    const idx = this.indexOf(item);
    if (idx === -1) return this;
    this.splice(idx, 1);
    return this;
}

Array.prototype.range = function(start, end, step) {
    if (!end) {
        end = start;
        start = 0;
    }

    if (step === undefined) step = end > start ? 1 : -1;

    const toReturn = [];
    for (let ii = start; ii < end; ii += step) {
        toReturn.push(ii);
    }

    return toReturn;
}