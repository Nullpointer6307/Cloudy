import { ParameterFramework } from "../ParameterFramework";
import ValueError from "../../../Error/ValueError";
export class NumberParameter extends ParameterFramework {
    constructor(flag, options) {
        super(flag, options, NumberParameter.numberDefaultOptions);
    }
    parse(stringValue) {
        let integerValue;
        if (stringValue === undefined) {
            const defaultValue = this.options.defaultInt;
            if (defaultValue === undefined) {
                this.options.errorMessage = undefined;
                return undefined;
            }
            integerValue = defaultValue;
        }
        else {
            integerValue = Number(stringValue);
        }
        if (isNaN(integerValue)) {
            this.options.errorMessage = new ValueError('Value is not a number.');
            return undefined;
        }
        const clamp = this.options.clamp;
        if (clamp !== undefined) {
            if (!clamp.isInRange(integerValue)) {
                if (this.options.cutInt) {
                    integerValue = clamp.cut(integerValue);
                }
                else {
                    this.options.errorMessage = new ValueError(`Value is out of range [${clamp.min}, ${clamp.max}].`);
                    return undefined;
                }
            }
        }
        if (!this.options.allowFloat) {
            if (integerValue % 1 === 0)
                return integerValue;
            if (this.options.cutInt)
                return Math.floor(integerValue);
            this.options.errorMessage = new ValueError(`Value can't be a float number.`);
            return undefined;
        }
        return integerValue;
    }
    static numberDefaultOptions = {
        cutInt: false,
        allowFloat: true,
        defaultInt: undefined,
        clamp: undefined,
        canPassUndefined: true,
        canReturnUndefined: false,
        errorMessage: undefined,
    };
}
