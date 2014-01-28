define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        Song				= require('app/models/song'),

        Songs = Backbone.Collection.extend({

			model: Song,
			
			url: "http://api.djs-music.com/songs",
			
			initialize: function(){
				console.log('SongCollection: init');
			}/*,
			
			sync: function(method, response){
				console.log("SongCollection: Synced: ", response.models);
				return response;
			},
			   
			parse: function(method, response){
				console.log("SongCollection: Received response: ",response);
				return response;
			}*/

        });

    return Songs;


});