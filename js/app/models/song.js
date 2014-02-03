define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),

        Model = Backbone.Model.extend({
        	
        	initialize: function(options){
        		console.log('Song: init');
        		this.songId = options.songId;
			},
			
			url: function(){
				return "http://api.djs-music.com/music/"+this.songId;
			}
        });

    return Model;
});