require.config({

    baseUrl: '/js/lib/',
    
    paths: {
        app: '../app',
        tpl: '../tpl',
        jquery : 'jquery-1.9.1.min',
        backbone : 'backbone-min',
        text : 'text',
        underscore : 'underscore-min',
        soundmanager2 : 'soundmanager/script/soundmanager2-jsmin',
        slider : 'bootstrap-slider',
    	utils: '../app/utils',
    	nanobar: 'nanobar-min',
    	display: 'display'
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
        },
        'nanobar':{
        	exports: 'Nanobar'
        }
    }
});