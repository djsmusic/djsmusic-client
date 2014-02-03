define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        Album				= require('app/models/album'),

        collection = Backbone.Collection.extend({

			model: Album,
			
			initialize: function(models, options){
				console.log('Albums: init');
			},
			
			url: function(){
				return "http://api.djs-music.com/albums";
			}

        });

    return collection;


});