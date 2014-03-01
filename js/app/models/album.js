define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        App					= require('app/app'),

        Model = Backbone.Model.extend({
			
			initialize: function(options){
				this.albumId = options.albumId;
			},
			
			url: function(){
				return App.url+"albums/"+this.albumId;
			}
        });

    return Model;
});