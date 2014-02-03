define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),

        Model = Backbone.Model.extend({
			
			initialize: function(options){
				console.log('User: init');
				this.userId = options.userId;
			},
			
			url: function(){
				return "http://api.djs-music.com/users/"+this.userId;
			}
        });

    return Model;
});