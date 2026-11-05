import { CommandProcessor, CommandRegistry } from "./Command";
import { MessageHandler } from "../Utils/MessageHandler";
import ErrorHandler from "../Error/ErrorHandler";
export function commandInputHandler(player, message, ignoreAccessRestrictions) {
    const [command, commandClassName, rawArguments] = MessageHandler.parseRawCommandMessage(message);
    const commandObject = CommandRegistry.getByAlias(command);
    if (commandObject === undefined) {
        ErrorHandler.showPlayer(player, new Error("Command not found"));
        return undefined;
    }
    const result = CommandProcessor.executeCommand(player, commandObject, commandClassName, rawArguments, ignoreAccessRestrictions);
    if (!(result instanceof Error))
        return;
    ErrorHandler.showPlayer(player, result);
}
