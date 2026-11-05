export default class CommandError extends Error {
    placeholderText;
    constructor(message) {
        super(message);
        this.name = "CommandError";
        this.placeholderText = "§o§f{name}:§r§6 {message}";
    }
}
