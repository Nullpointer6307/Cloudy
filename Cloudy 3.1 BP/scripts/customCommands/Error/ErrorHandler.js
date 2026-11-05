import { Placeholder } from "../Utils/Placeholder";
export default class ErrorHandler {
    static showPlayer(receiver, error) {
        if ("placeholderText" in error) {
            const message = Placeholder.parse(error.placeholderText, {
                name: error.name,
                message: error.message,
            });
            receiver.sendMessage(message);
        }
        else {
            receiver.sendMessage(`§o§f${error.name} §r§c${error.message}`);
        }
    }
}
