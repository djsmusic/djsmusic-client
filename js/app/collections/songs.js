define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        Song				= require('app/models/song'),
        API					= require('api'),

        collection = Backbone.Collection.extend({

			model: Song,
			
			initialize: function(models, options){
				console.log('Songs: init');
				
				this._meta = {};
			},
			
			url: function(){
				return API.url+"/music";
			},
			
			meta: function(prop, value) {
				if(typeof(prop) === 'undefined'){
					// Get all
					return this._meta;
				}else if(typeof(value) === 'undefined'){
					// Get one
		            return this._meta[prop];
		        }else{
		        	// Setter, triggers an event (duh)
		        	console.log('SongCollection: Set meta '+prop+'='+value);
		            this._meta[prop] = value;
		            this.trigger('set:meta');
		        }
		    },

        });

    return collection;

});