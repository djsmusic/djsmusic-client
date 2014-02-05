define(function (require) {

    "use strict";
    
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/Comments.html'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(data){
    		if(typeof(data)!=='undefined' && typeof(data.url)!=='undefined') this.url = data.url;
    		if(typeof(FB)=='object'){
    			FB.init({
                    appId      : '438776356218114', // App ID
                    status     : false, 			// check login status
                    cookie     : true, 				// enable cookies to allow the server to access the session
                    xfbml      : true  				// parse XFBML
            	});
    		}else{
    			console.error('Comments: No Facebook API detected!');
    		}
    	},

        render: function () {
        	if(typeof(this.url)==='undefined'){
        		// Generate the URL if none was specified
        		this.url = '/'+Backbone.history.getFragment();
        	}
        	
        	// Process the tags
        	this.$el.html(template({
                url: this.url,	// Commenting item: Ex. '/music/123'
                lang: ''		// Ex. lang: 'es.'
            }));
            return this;
        }

    });

});