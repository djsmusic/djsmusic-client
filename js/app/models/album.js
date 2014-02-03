define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),

        Model = Backbone.Model.extend({
			
			initialize: function(options){
				console.log('Albums: init');
				this.albumId = options.albumId;
			},
			
			url: function(){
				return "http://api.djs-music.com/albums/"+this.albumId;
			}
        });

    return Model;
});