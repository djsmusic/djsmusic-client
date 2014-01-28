define(function (require) {

    "use strict";

    var $                       = require('jquery'),
        _                       = require('underscore'),
        Backbone                = require('backbone'),
        SongListItemView    	= require('app/views/SongListItem');

    return Backbone.View.extend({
    	
    	tagName: 'tbody',

        initialize: function () {
        	console.log("SongList: Init");
        	console.log("SongList: Fetching collection");
            this.collection.on("reset", this.render, this);
            this.collection.on("add", this.render, this);
            this.collection.fetch({
            	success: function(model, data){
            		console.log("SongList: Fetched", data);
            	},
            	error: function(model, err){
            		console.log("SongList: Not fetched", err);
            	}
            });
        },

        render: function () {
        	console.log('SongList: Received collection: ', this.collection.models);
        	this.$el.empty();
		    _.each(this.collection.models, function (song) {
            	this.$el.append(new SongListItemView({model: song}).render().el);
            }, this);
            
            return this;
        }
    });

});

