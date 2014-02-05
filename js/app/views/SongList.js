define(function (require) {

    "use strict";

    var $                       = require('jquery'),
        _                       = require('underscore'),
        Backbone                = require('backbone'),
        SongListItemView    	= require('app/views/SongListItem');

	return Backbone.View.extend({
		
		tagName: 'ul',
		
		initialize: function () {
			console.log("SongList: Init");
			this.collection.on("reset", this.render, this);
			this.collection.on("fetched", this.fetched, this);
			this.collection.on("add", this.renderOne, this);
		},
		
		render: function () {
			this.$el.empty().addClass('list-group');
			
			_.each(this.collection.models, function (song) {
				this.$el.append(new SongListItemView({model: song}).render().el);
			}, this);
			
			return this;
		},
		
		fetched: function(){
			if(this.collection.length == 0){
				this.$el.append('<li class="media"><div class="alert alert-warning">No results</div></li>');
			}
			return this;
		},
		       
		renderOne: function (model) {
			this.$el.append(new SongListItemView({model: model}).render().el);
			return this;
		}
	});

});

