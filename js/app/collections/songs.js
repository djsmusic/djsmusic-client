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
			},
			
			url: function(){
				return API.url+"/music";
			}

        });

    return collection;

});