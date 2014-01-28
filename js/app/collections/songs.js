define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        Song				= require('app/models/song'),

        Songs = Backbone.Collection.extend({

			model: Song,
			
			url: function(){
				return "http://api.djs-music.com/songs/"+this.type;
			},
			
			initialize: function(models, options){
				console.log('SongCollection: init');
				this.type = options.type;
			}

        });

    return Songs;


});