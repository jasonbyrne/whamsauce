import { Promise } from './promise';
import { Load } from './load';
import { Rule } from './rule';
import { Router } from './router';
import { Controller } from './controller';
import { Component } from './component';
import { Exception } from './exception';


class App {

    static init(routes:any):Promise {
        let promise = new Promise();
        // Listen for history change
        window.addEventListener('popstate', function() {
            Router.execute(window.location.pathname);
        }, false);
        // Listen for hash change
        window.addEventListener("hashchange",function(){
            var hash = location.hash;
            if (hash.length > 0) {
                hash = hash.substr(1, hash.length - 1);
                Router.execute(hash);
            }
        });
        //
        Load.all(
            '/vendor/handlebars.min.js',
            '/vendor/cash.min.js'
        ).then(function(results) {
            Router.init(routes);
            $('body').on('click', 'a', function(e) {
                var href = $(this).attr('href');
                if (href.length > 0 && href.substr(0, 1) == '/') {
                    e.preventDefault();
                    history.pushState(null, null, href);
                    Router.execute(href);
                }
            });
            promise.resolve();
        });
        return promise;
    }

}

export { Promise, Load, Exception, Rule, Router, Controller, Component, App };
