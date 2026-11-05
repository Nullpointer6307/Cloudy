import { ParameterFramework } from "../ParameterFramework.js";
import ValueError from "../../../Error/ValueError.js";
import { world } from "@minecraft/server";
export class PlayerParameter extends ParameterFramework {
    constructor(flag, options) {
        super(flag, options, PlayerParameter.stringDefaultOptions);
    }
    parse(stringValue, player) {
        if (stringValue === undefined) {
            const defaultValue = this.options.defaultSelf
                ? player.name
                : undefined;
            if (defaultValue === undefined) {
                this.options.errorMessage = undefined;
                return undefined;
            }
            stringValue = defaultValue;
        }
        if (stringValue.startsWith("@"))
            stringValue = stringValue.slice(1);
        const targetPlayer = this.getPlayerByName(stringValue);
        if (!targetPlayer) {
            this.options.errorMessage = new ValueError("Player not found");
            return undefined;
        }
        if (targetPlayer.id === player.id && !this.options.canBeSelf) {
            this.options.errorMessage = new ValueError("Cannot target self");
            return undefined;
        }
        return targetPlayer;
    }
    getPlayerByName(name) {
        return world.getPlayers({ name: name })[0];
    }
    static stringDefaultOptions = {
        canBeSelf: false,
        defaultSelf: false,
        canPassUndefined: true,
        canReturnUndefined: false,
        errorMessage: undefined,
    };
}
