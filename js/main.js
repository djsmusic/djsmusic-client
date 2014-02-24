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
    
    config:{
    	'api': {
    		// App mode: 1= Testing, 0= Production
    		'mode': 0
    	}
    },
    
    paths: {
        app: '../app',
        tpl: '../tpl',
        jquery : '../lib/jquery-1.9.1.min',
        backbone : '../lib/backbone-min',
        text : '../lib/text',
        underscore : '../lib/underscore-min',
        soundmanager2 : '../lib/soundmanager/script/soundmanager2-jsmin',
        slider : '../lib/bootstrap-slider',
    	api : '../app/api',
    	utils: '../app/utils'
    },

    map: {
        '*': {
            'app/models/employee': 'app/models/memory/employee',
            'app/models/song': 'app/models/song'
        }
    },

    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'underscore': {
            exports: '_'
        },
        'soundmanager2':{
        	exports: 'soundManager'
        }
    }
});

require(['jquery', 'backbone', 'app/app', 'app/router', 'app/models/Session'], function ($, Backbone, App, Router, Session) {
    var router = new Router();
    
    // Create a new session model and scope it to the app global
    // This will be a singleton, which other modules can access
    App.session = new Session({});

    // Check the auth status upon initialization,
    // before rendering anything or matching routes
    App.session.checkAuth({

        // Start the backbone routing once we have captured a user's auth status
        complete: function(){
			// HTML5 pushState for URLs without hashbangs
            /*var hasPushstate = !!(window.history && history.pushState);
            if(hasPushstate) Backbone.history.start({ pushState: true, root: '/' } );
            else Backbone.history.start();*/
			Backbone.history.start();
        }
    });
});
