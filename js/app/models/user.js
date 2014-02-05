define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        API					= require('api'),

        Model = Backbone.Model.extend({
			
			initialize: function(options){
				this.userId = options.userId;
			},
			
			url: function(){
				return API.url+"users/"+this.userId;
			}
        });

    return Model;
});