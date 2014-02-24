/**
 * @desc        app globals
 */
define([
    "jquery",
    "underscore",
    "backbone",
    "utils"
],
function($, _, Backbone) {
	
	console.log('App: init');

    var app = {
        root : "/",                     // The root path to run the application through.
        URL : "/",                      // Base application URL
        API : "/api",                   // Base API URL (used by models & collections)

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

    // Global event aggregator
    app.eventAggregator = _.extend({}, Backbone.Events);

    return app;

});