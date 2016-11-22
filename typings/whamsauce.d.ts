// Type definitions for whamsauce
// Project: https://github.com/jasonbyrne/whamsauce
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

interface Promise {
    then(callback:Function)
    resolve(...any)
    done(...any)
}

interface Component {
    load()
}

interface Controller {
    init(Promise)
    onDependenciesLoaded(Function)
    render():string
    getTemplate():string
}

interface Load {
    script()
    all(...any)
}

interface Exception {

}

interface Rule {
    componentName:string
    componentPath:string
    pattern:RegExp
    isMatch(string):boolean
    getParams(string):any
}

interface Router {

}

interface Whamsauce {
    Promise:Promise
    Exception:Exception
    Controller:Controller
    Load:Load
    Rule:Rule
    Router:Router
    Component:Component
}
