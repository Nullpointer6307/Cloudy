import { ParameterFramework } from "../ParameterFramework.js";
import ValueError from "../../../Error/ValueError.js";
export class BooleanParameter extends ParameterFramework {
    constructor(flag, options) {
        super(flag, options, BooleanParameter.booleanDefaultOptions);
    }
    parse(stringValue) {
        if (stringValue === undefined) {
            const defaultBoolean = this.options.defaultBoolean;
            if (defaultBoolean !== undefined)
                return defaultBoolean;
            this.options.errorMessage = undefined;
            return undefined;
        }
        const stringBoolean = stringValue.trim().toLowerCase();
        if (stringBoolean === 'true')
            return true;
        if (stringBoolean === 'false')
            return false;
        this.options.errorMessage = new ValueError('Value is not a boolean.');
        return undefined;
    }
    static booleanDefaultOptions = {
        defaultBoolean: undefined,
        canPassUndefined: true,
        canReturnUndefined: false,
        errorMessage: undefined,
        description: undefined
    };
}
