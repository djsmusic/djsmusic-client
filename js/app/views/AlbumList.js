define(function (require) {

    "use strict";

    var $                       = require('jquery'),
        _                       = require('underscore'),
        Backbone                = require('backbone'),
        AlbumListItemView    	= require('app/views/AlbumListItem');

    return Backbone.View.extend({
    	
    	tagName: 'ul',

        initialize: function () {
        	console.log("AlbumList: Init");
        	this.collection.on("reset", this.render, this);
            this.collection.on("add", this.render, this);
        },

        render: function () {
        	$(this.el).addClass('media-list');
        	this.$el.empty();
		    _.each(this.collection.models, function (album) {
            	this.$el.append(new AlbumListItemView({model: album}).render().el);
            }, this);
            
            return this;
        }
    });

});

