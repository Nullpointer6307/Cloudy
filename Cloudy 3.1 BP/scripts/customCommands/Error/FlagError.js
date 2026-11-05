export default class FlagError extends Error {
    placeholderText;
    constructor(message) {
        super(message);
        this.name = "FlagError";
        this.placeholderText = "§o§f{name}:§r§6 {message}";
    }
}
