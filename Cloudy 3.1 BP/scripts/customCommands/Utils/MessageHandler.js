import { commandConfig } from "../Config";
const { CHAT_PREFIX, DEFAULT_COMMAND_CLASS } = commandConfig;
export class MessageHandler {
    static commandParseRegExp = /-([a-z]+)\s+("(?:[^"\\]*(?:\\.)?[^"\\]*)+"|\S+)/gi;
    static parseRawCommandMessage(message) {
        const [rawCommand, ...rest] = message.trim().split(/\s+/);
        const args = [];
        const [command, commandClass] = (rawCommand.startsWith(CHAT_PREFIX)
            ? rawCommand.replace(CHAT_PREFIX, "")
            : rawCommand).split(":");
        const commandBody = rest.join(" ");
        let match;
        while ((match = this.commandParseRegExp.exec(commandBody)) !== null) {
            const key = match[1];
            const value = (match[3] || match[2])
                .replace(/(?<!\\)"/g, "")
                .replace(/\\(.)/g, "$1");
            args.push([key, value]);
        }
        return [command, commandClass || DEFAULT_COMMAND_CLASS[0], args];
    }
}
