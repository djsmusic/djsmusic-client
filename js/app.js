/**
 * Application controller view
 * Starts application
 *
 * @class App
 * @extends Backbone.View
 * @author Alejandro U. Álvarez <alejandro@urbanoalvarez.es>
 */
require.config({

    baseUrl: 'js/lib',

    paths: {
        app: '../app',
        tpl: '../tpl',
        jquery : '../lib/jquery-1.9.1.min',
        backbone : '../lib/backbone-min',
        text : '../lib/text',
        underscore : '../lib/underscore-min'
    },

    map: {
        '*': {
            'app/models/employee': 'app/models/memory/employee'
        }
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        }
    }
});

require(['jquery', 'backbone', 'app/router'], function ($, Backbone, Router) {
    var router = new Router();
    Backbone.history.start();
});
