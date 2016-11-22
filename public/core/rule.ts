

export class Rule {

    public pattern:RegExp;
    public componentName:string;
    public componentPath:string;

    protected rawPattern:string;
    protected params:Array<string> = [];

    /**
     *
     * @param pattern
     * @param component
     */
    constructor(pattern:string, component:string) {
        this.rawPattern = pattern;
        this.componentName = component;
        this.componentPath = component.replace('_', '/');
        // Get pattern parameters
        let matches = pattern.match(/{[a-z0-9_]+}/ig);
        if (matches != null) {
            for (let i=0; i < matches.length; i++) {
                let param:string = matches[i];
                this.params.push(param.substring(1, param.length - 1));
            }
        }
        // Turn pattern into regex
        pattern = pattern.replace(/{[a-z0-9_]+}/ig, '([a-z0-9_]+)');
        this.pattern = new RegExp('^' + pattern + '$', 'i');
    }

    /**
     *
     * @param path
     * @returns {any}
     */
    public getParams(path:string):any {
        let out:any = {},
            matches = path.match(this.pattern);
        if (matches != null) {
            for (let i=1; i < matches.length; i++) {
                let key:string = this.params[i - 1];
                out[key] = matches[i];
            }
        }
        return out;
    }

    /**
     *
     * @param path
     * @returns {boolean}
     */
    public isMatch(path:string):boolean {
        return this.pattern.test(path);
    }

}
