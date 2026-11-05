export class NumberRange {
    min;
    max;
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    toArray() {
        return [this.min, this.max];
    }
    toString(separator = ", ") {
        return `${this.min}${separator}${this.max}`;
    }
    copy() {
        return new NumberRange(this.min, this.max);
    }
    isInRange(value) {
        return value >= this.min && value <= this.max;
    }
    offset(value) {
        return value < this.min ? this.min - value : value > this.max ? value - this.max : 0;
    }
    cut(value) {
        return value < this.min ? this.min : value > this.max ? this.max : value;
    }
}
