var Whamsauce = window.Whamsauce = require("./core/app");

Whamsauce.App.init({
    "/": "Home",
    "/profiles/{name}/test/{id}": "Profile",
    ".*": "FileNotFound"
}).then(function() {
    Whamsauce.Router.execute(window.location.pathname);
});

