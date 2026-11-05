export default class ValueError extends Error {
    placeholderText;
    constructor(message) {
        super(message);
        this.name = "CommandError";
        this.placeholderText = "§o§f{name}:§r§c {message}";
    }
}
