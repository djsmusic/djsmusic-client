define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        Album				= require('app/models/album'),
        App					= require('app/app'),

        collection = Backbone.Collection.extend({

			model: Album,
			
			url: function(){
				return App.url+"albums";
			}

        });

    return collection;


});