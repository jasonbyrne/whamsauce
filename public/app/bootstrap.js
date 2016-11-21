// Initialize our base script after the DOM has loaded
document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener('popstate', function () {
        Whamsauce.Router.execute(window.location.pathname);
    }, false);
    window.addEventListener("hashchange", function () {
        var hash = location.hash;
        if (hash.length > 0) {
            hash = hash.substr(1, hash.length - 1);
            Whamsauce.Router.execute(hash);
        }
    });
    var PATH_ROUTES = '/conf/routes.json';
    Whamsauce.Load.all(PATH_ROUTES, '/vendor/handlebars.min.js', '/vendor/cash.min.js').then(function (results) {
        Whamsauce.Router.init(results[PATH_ROUTES].data);
        Whamsauce.Router.execute(window.location.pathname);
        $('body').on('click', 'a', function (e) {
            var href = $(this).attr('href');
            if (href.length > 0 && href.substr(0, 1) == '/') {
                e.preventDefault();
                history.pushState(null, null, href);
                Whamsauce.Router.execute(href);
            }
        });
    });
});
//# sourceMappingURL=bootstrap.js.map