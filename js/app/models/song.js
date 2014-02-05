define(function (require, exports, module) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        API					= require('api'),

        Model = Backbone.Model.extend({
        	
        	initialize: function(options){
        		this.songId = options.songId;
			},
			
			url: function(){
				return API.url+"/music/"+this.songId;
			}
        });

    return Model;
});