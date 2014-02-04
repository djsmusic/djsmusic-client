define(function (require) {

    "use strict";

    var $                       = require('jquery'),
        _                       = require('underscore'),
        Backbone                = require('backbone'),
        SongListItemView    	= require('app/views/SongBigListItem');

    return Backbone.View.extend({
    	
    	tagName: 'div',

        initialize: function () {
        	console.log("SongBigList: Init");
        	this.collection.on("reset", this.render, this);
            this.collection.on("add", this.render, this);
        },

        render: function () {
        	this.$el.addClass('big-list');
        	this.$el.empty();
		    _.each(this.collection.models, function (song) {
            	this.$el.append(new SongListItemView({model: song}).render().el);
            }, this);
            
            return this;
        }
    });

});

