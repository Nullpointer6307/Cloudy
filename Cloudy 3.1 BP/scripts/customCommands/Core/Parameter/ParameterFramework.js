;
export class ParameterFramework {
    flag;
    options;
    constructor(flag, options, defaultOptions) {
        this.flag = flag;
        this.options = { ...defaultOptions, ...options };
    }
    description;
    setDescription(description) {
        this.description = description;
        return this;
    }
}
