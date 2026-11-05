import { ParameterHandler } from "./Parameter/ParameterHandler";
import CommandError from "../Error/CommandError";
import { commandConfig } from "../Config";
import { Weight } from "../Utils/Weight";
const DEFAULT_COMMAND_CLASS = commandConfig.DEFAULT_COMMAND_CLASS;
export class Command {
    aliases;
    enabled;
    hidden;
    description = "";
    classes;
    permissions = [];
    onEnableCallback = null;
    onDisableCallback = null;
    constructor(aliases) {
        this.enabled = true;
        this.hidden = false;
        this.aliases = aliases;
        this.classes = new Map();
    }
    get isEnabled() {
        return this.enabled;
    }
    setAccess(state) {
        this.enabled = state;
        if (state === true) {
            this.onEnableCallback?.(this);
        }
        else {
            this.onDisableCallback?.(this);
        }
    }
    isHidden(state) {
        this.hidden = state;
        return this;
    }
    onEnable(callback) {
        this.onEnableCallback = callback;
        return this;
    }
    onDisable(callback) {
        this.onDisableCallback = callback;
        return this;
    }
    setPermission(...permission) {
        this.permissions = [...permission];
        return this;
    }
    setDescription(...description) {
        this.description = description.join("\n");
        return this;
    }
    setClass(classNames, callback) {
        classNames = classNames
            ? classNames.length > 0
                ? classNames
                : DEFAULT_COMMAND_CLASS
            : DEFAULT_COMMAND_CLASS;
        const commandClass = new CommandClass(...classNames);
        void callback(commandClass, this);
        for (const className of classNames) {
            this.classes.set(className, commandClass);
        }
        return this;
    }
}
//  COMMAND CLASS  //
class CommandClass {
    overloads;
    classNames;
    description = "";
    classPermission;
    constructor(...classNames) {
        this.classNames = classNames;
        this.classPermission = [];
        this.overloads = [];
    }
    /**
     * Adds an overload to this command class
     */
    overload(callback, executor) {
        const overload = new CommandOverload(executor);
        if (typeof callback === "function")
            callback(overload, this);
        this.overloads.push(overload);
        return this;
    }
    setDescription(...description) {
        this.description = description.join("\n");
        return this;
    }
    setClassPermissions(...permission) {
        this.classPermission = [...permission];
        return this;
    }
}
//  COMMAND OVERLOAD  //
export class CommandOverloadExecuterEventArgs {
    player;
    args;
    constructor(player, args) {
        this.player = player;
        this.args = args;
    }
    getString(flagId, required) {
        const value = this.get(flagId);
        if (required && value == null)
            this.flagMissing(flagId);
        return value;
    }
    getNumber(flagId, required) {
        const value = this.get(flagId);
        if (required && value == null)
            this.flagMissing(flagId);
        return value;
    }
    getBoolean(flagId, required) {
        const value = this.get(flagId);
        if (required && value == null)
            this.flagMissing(flagId);
        return value;
    }
    getModule(flagId, required) {
        const value = this.get(flagId);
        if (required && value == null)
            this.flagMissing(flagId);
        return value;
    }
    getPlayer(flagId, required) {
        const value = this.get(flagId);
        if (required && value == null)
            this.flagMissing(flagId);
        return value;
    }
    flagMissing(flagId) {
        throw new Error(`Required flag "${flagId}" is missing.`);
    }
    get(flagId) {
        return this.args[flagId] || null;
    }
}
export class CommandOverload {
    parameters = [];
    description = "";
    overloadPermission = [];
    executor;
    constructor(executor) {
        this.executor = executor;
    }
    addParameters(...parameters) {
        this.parameters.push(...parameters);
        return this;
    }
    setDescription(...description) {
        this.description = description.join("\n");
        return this;
    }
    setPermissions(...permission) {
        this.overloadPermission = [...permission];
        return this;
    }
}
export class CommandProcessor {
    /**
     * Processes the given overloads with the given arguments
     */
    static processOverloads(player, overloads, commandArguments, ignoreAccessRestrictions = false) {
        const overloadWeights = [];
        for (const overload of overloads) {
            const results = this.evaluateOverload(player, overload, commandArguments, ignoreAccessRestrictions);
            if (results.content.success) {
                return {
                    overload: overload,
                    resultData: results.content.value
                };
            }
            overloadWeights.push(new Weight(results.weight, {
                overload: overload,
                resultData: results.content.value
            }));
        }
        return Weight.getHeaviest(overloadWeights).content;
    }
    /**
     * Evaluates the given overload with the given arguments
     */
    static evaluateOverload(player, overload, commandArguments, ignoreAccessRestrictions) {
        if (!ignoreAccessRestrictions && overload.overloadPermission.length > 0) {
            return this.createCommandErrorResult("You do not have permission to use this command overload");
        }
        return ParameterHandler.parseAll(player, commandArguments, overload.parameters);
    }
    /**
     * Creates a command error result with the given message
     */
    static createCommandErrorResult(message) {
        return {
            content: {
                success: false,
                value: new CommandError(message)
            },
            weight: 0
        };
    }
    /**
     * Executes the given command with the given arguments
     */
    static executeCommand(player, command, commandClassName, commandArguments, ignoreAccessRestrictions = false) {
        //* check if command is enabled
        if (ignoreAccessRestrictions === false) {
            if (command.isEnabled === false) {
                return new CommandError("This command is currently disabled");
            }
            // const permissions = command.permissions || [];
            // if (ignoreAccessRestrictions === false && permissions.length > 0 && <<PLACEHOLDER>>) {
            //     return new CommandError("You do not have permission to use this command");
            // }
        }
        const commandClass = this.getCommandClass(commandClassName, command);
        if (commandClass === null) {
            return new CommandError("Command class not found");
        }
        // const classPermission = commandClass.classPermission || [];
        // if (ignoreAccessRestrictions === false && classPermission.length > 0 && <<PLACEHOLDER>>) {
        //     return new CommandError("You do not have permission to use this command class");
        // }
        const overloadResult = this.processOverloads(player, commandClass.overloads, commandArguments, ignoreAccessRestrictions), resultData = overloadResult.resultData;
        if (resultData instanceof Error)
            return resultData;
        const eventArgs = new CommandOverloadExecuterEventArgs(player, resultData);
        overloadResult.overload.executor(eventArgs);
        return overloadResult;
    }
    static getCommandClass(commandClassName, command) {
        return command.classes.get(commandClassName) || null;
    }
}
//  COMMAND REGISTRY  //
export class CommandRegistry {
    static commands = new Map();
    static get size() {
        return this.commands.size;
    }
    static register(commands, initialAccessState = true) {
        for (const command of commands) {
            for (const alias of command.aliases) {
                if (this.commands.has(alias))
                    throw new Error(`Command alias ${alias} is already in use.`);
                this.commands.set(alias, command);
            }
            if (initialAccessState)
                command.setAccess(true);
        }
    }
    static unregister(commands) {
        for (const command of commands)
            this.commands.delete(command.aliases[0]);
    }
    static getByAlias(commandAlias) {
        return this.commands.get(commandAlias);
    }
    static has(commandAlias) {
        return this.commands.has(commandAlias);
    }
    static setCommandAccess(alias, accessable) {
        const command = this.commands.get(alias);
        if (command === undefined)
            return false;
        command.setAccess(accessable);
        return true;
    }
    static setAllCommandAccesses(accessable) {
        for (const command of this.commands.values())
            command.setAccess(accessable);
    }
    static getAll() {
        const commands = new Set();
        for (const command of this.commands.values()) {
            commands.add(command);
        }
        return Array.from(commands);
    }
}
