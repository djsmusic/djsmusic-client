define(function (require, exports, module) {
	
	console.log('App: init');
	
	var $           = require('jquery'),
        Backbone    = require('backbone'),

    	app = {
	        productionUrl: 'http://api.djs-music.com/',
	    	localUrl: 'http://localhost/djsmusic/',
	    	url: '',
	    	mode: 0,	// API mode: 1= Testing, 0= Production
	
	        // Show alert classes and hide after specified timeout
	        showAlert: function(title, text, klass) {
	        	alert(text);/*
	            $("#header-alert").removeClass("alert-error alert-warning alert-success alert-info");
	            $("#header-alert").addClass(klass);
	            $("#header-alert").html('<button class="close" data-dismiss="alert">×</button><strong>' + title + '</strong> ' + text);
	            $("#header-alert").show('fast');
	            setTimeout(function() {
	                $("#header-alert").hide();
	            }, 7000 );*/
	        }
	    };
	
	// force ajax call on all browsers
    $.ajaxSetup({ cache: false });
    
    app.url = app.productionUrl;
    
    if(app.mode == 1){
    	console.info('API: Local mode');
    	app.url = app.localUrl;
    }

    // Global event aggregator
    app.eventAggregator = _.extend({}, Backbone.Events);

    return app;

});