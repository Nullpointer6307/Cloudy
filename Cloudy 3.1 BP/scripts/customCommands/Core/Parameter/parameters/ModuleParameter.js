import { ParameterFramework } from "../ParameterFramework";
import ValueError from "../../../Error/ValueError";
export class ModuleParameter extends ParameterFramework {
    constructor(flag, options) {
        for (const module of (options.modules || [])) {
            if (module.includes(" "))
                throw new Error(`Modules can't contain spaces: ${module}`);
        }
        super(flag, options, ModuleParameter.moduleDefaultOptions);
    }
    parse(stringValue) {
        if (stringValue === undefined) {
            const defaultModule = this.options.defaultModule;
            if (defaultModule !== undefined)
                return [defaultModule];
            this.options.errorMessage = undefined;
            return undefined;
        }
        const stringModules = stringValue.toLowerCase().split(/\s*,\s*/g);
        if (stringModules.length > 1 && !this.options.allowMultipleChoices) {
            this.options.errorMessage = new ValueError('Multiple choices are not allowed.');
            return undefined;
        }
        for (const stringModule of stringModules) {
            if (this.options.modules.includes(stringModule))
                continue;
            this.options.errorMessage = new ValueError(`Invalid module: ${stringModule}.`);
            return undefined;
        }
        return stringModules;
    }
    static moduleDefaultOptions = {
        modules: [],
        allowMultipleChoices: false,
        defaultModule: undefined,
        canPassUndefined: true,
        canReturnUndefined: false,
        errorMessage: undefined
    };
}
