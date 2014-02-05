define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        Album				= require('app/models/album'),
        API					= require('api'),

        collection = Backbone.Collection.extend({

			model: Album,
			
			url: function(){
				return API.url+"/albums";
			}

        });

    return collection;


});