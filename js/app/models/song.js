define(function (require, exports, module) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        App					= require('app/app'),

        Model = Backbone.Model.extend({
        	
        	initialize: function(options){
        		this.songId = options.songId;
			},
			
			url: function(){
				return App.url+"music/"+this.songId;
			}
        });

    return Model;
});