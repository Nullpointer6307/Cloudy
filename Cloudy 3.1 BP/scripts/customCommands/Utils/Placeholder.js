export class Placeholder {
    placeholderText;
    defaultValue;
    constructor(placeholderText, defaultValue = "N/A") {
        this.placeholderText = placeholderText;
        this.defaultValue = defaultValue;
    }
    parse(content) {
        return Placeholder.parse(this.placeholderText, content, this.defaultValue);
    }
    static parse(placeholderText, content, defaultValue = "N/A") {
        return placeholderText.replace(/\{(\w+)\}/g, (_, key) => {
            const value = content[key];
            if (value) {
                return typeof value === "function"
                    ? value(key, defaultValue)
                    : value;
            }
            return defaultValue;
        });
    }
}
