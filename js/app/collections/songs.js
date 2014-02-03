define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        Song				= require('app/models/song'),

        collection = Backbone.Collection.extend({

			model: Song,
			
			initialize: function(models, options){
				console.log('Songs: init');
			},
			
			url: function(){
				return "http://api.djs-music.com/music";
			}

        });

    return collection;

});