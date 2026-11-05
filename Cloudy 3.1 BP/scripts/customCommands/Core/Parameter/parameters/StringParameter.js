import { ParameterFramework } from "../ParameterFramework.js";
import ValueError from "../../../Error/ValueError.js";
export class StringParameter extends ParameterFramework {
    constructor(flag, options) {
        super(flag, options, StringParameter.stringDefaultOptions);
    }
    parse(stringValue) {
        if (stringValue === undefined) {
            const defaultValue = this.options.defaultValue;
            if (defaultValue === undefined) {
                this.options.errorMessage = undefined;
                return undefined;
            }
            stringValue = defaultValue;
        }
        const length = stringValue.length, maxLength = this.options.maxLength, cut = this.options.cut;
        if (length > maxLength) {
            if (!cut) {
                this.options.errorMessage = new ValueError(`String exceeds maximum length of ${maxLength} characters.`);
                return undefined;
            }
            stringValue = stringValue.substring(0, maxLength);
        }
        if (length < this.options.minLength) {
            this.options.errorMessage = new ValueError(`String is less than minimum length of ${this.options.minLength} characters.`);
            return undefined;
        }
        if (this.options.toUpperCase)
            return stringValue.toUpperCase();
        else if (this.options.toLowerCase)
            return stringValue.toLowerCase();
        else
            return stringValue;
    }
    static stringDefaultOptions = {
        cut: false,
        toUpperCase: false,
        toLowerCase: false,
        maxLength: Infinity,
        minLength: 0,
        defaultValue: undefined,
        canPassUndefined: true,
        canReturnUndefined: false,
        errorMessage: undefined,
    };
}
