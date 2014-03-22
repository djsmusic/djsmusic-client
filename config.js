'use strict';

require.config({

    name: 'main',
    
    baseUrl: "js/",
    
    optimize: "none",
    
    paths: {
    	app: 'app',
        tpl: 'tpl',
        jquery : 'lib/jquery-1.9.1.min',
        backbone : 'lib/backbone-min',
        text : 'lib/text',
        underscore : 'lib/underscore-min',
        soundmanager2 : 'lib/soundmanager/script/soundmanager2-jsmin',
        slider : 'lib/bootstrap-slider',
    	utils: 'app/utils',
    	nanobar: 'lib/nanobar-min',
    	display: 'lib/display',
    	requireLib: 'lib/require-2.1.9'
    },
    
    include: [
    	'requireLib'
    ],
    
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
        },
        'nanobar':{
        	exports: 'Nanobar'
        }
    } 
     
});