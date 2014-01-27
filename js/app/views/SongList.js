define(function (require) {

    "use strict";

    var $                       = require('jquery'),
        _                       = require('underscore'),
        Backbone                = require('backbone'),
        SongListItemView    	= require('app/views/SongListItem');

    return Backbone.View.extend({
    	
    	tagName: 'tbody',

        initialize: function () {
        	console.log("Received collection on init: ", this.collection);
        	console.log("Container: ",this.el);
            this.collection.on("reset", this.render, this);
            this.collection.on("add", this.render, this);
            this.collection.fetch();
        },

        render: function () {
        	console.log('Render collection: ', this.collection);
        	console.log("Render on ", this.$el);
        	this.$el.empty();
		    _.each(this.collection.models, function (song) {
            	this.$el.append(new SongListItemView({model: song}).render().el);
            }, this);
            
            return this;
        }
    });

});

