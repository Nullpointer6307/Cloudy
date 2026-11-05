import FlagError from "../../Error/FlagError";
import { Weight } from "../../Utils/Weight";
export class ParameterHandler {
    static parseAll(player, commandArgs, parameters) {
        const argSet = new Map(commandArgs), values = {};
        let weightCount = 0;
        for (const parameter of parameters) {
            const parameterFlag = parameter.flag;
            const parsedValue = this.parse(player, argSet.get(parameterFlag), parameter);
            if (parsedValue instanceof Error)
                return new Weight(weightCount, {
                    value: parsedValue,
                    success: false
                });
            argSet.delete(parameterFlag);
            values[parameter.flag] = parsedValue;
            weightCount++;
        }
        return new Weight(weightCount, {
            value: values,
            success: weightCount === parameters.length
        });
    }
    static parse(player, arg, parameter) {
        try {
            if (arg === undefined && !parameter.options.canPassUndefined) {
                return new FlagError(`Missing value at Parameter [${parameter.flag}]`);
            }
            const parsedValue = parameter.parse(arg, player);
            if (parsedValue === undefined && !parameter.options.canReturnUndefined) {
                return parameter.options.errorMessage
                    ?? new FlagError(`Missing value at Parameter [${parameter.flag}]`);
            }
            return parsedValue;
        }
        catch (e) {
            return e;
        }
    }
}
