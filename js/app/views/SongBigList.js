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
        	this.collection.on("fetched", this.check, this);
            this.collection.on("add", this.renderOne, this);
        },

        render: function () {
        	this.$el.empty().addClass('big-list');
        	
        	_.each(this.collection.models, function (song) {
				this.$el.append(new SongListItemView({model: song}).render().el);
			}, this);
            
            return this;
        },
        
        check: function(){
        	if(this.collection.length == 0){
				this.$el.html('<div class="media"><div class="alert alert-warning"><i class="fa fa-exclamation-triangle"></i> No results</div></div>');
			}
			return this;
        },
		       
		renderOne: function (model) {
			this.$el.append(new SongListItemView({model: model}).render().el);
			return this;
		}
    });

});

