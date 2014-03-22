define(function (require, exports, module) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        App					= require('app/app'),

        Model = Backbone.Model.extend({
        	
        	initialize: function(options){
        		if(typeof(options.songId)!=='undefined'){
        			this.set('id', options.songId);
        			delete options.songId;
        		}
			},
			
			url: function(){
				return App.url+"music/"+this.get('id');
			}
        });

    return Model;
});