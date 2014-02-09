define(function (require) {

    "use strict";

    var $                       = require('jquery'),
        _                       = require('underscore'),
        Backbone                = require('backbone'),
        SongListItemView    	= require('app/views/SongSmallListItem');

    return Backbone.View.extend({
    	
    	tagName: 'div',
    	
    	initialize: function () {
        	console.log("SongSmallList: Init");
        	
        	this.$el.html('<ul></ul>').addClass('dropdown-menu').addClass('small-list');
        	
			this.collection.on("reset", this.renderAgain, this);
        	this.collection.on("fetched", this.check, this);
            this.collection.on("add", this.renderOne, this);
        },
        
        events: {
    		
    	},

        render: function () {
        	this.$el.empty();
        	
        	_.each(this.collection.models, function (song) {
				this.$el.append(new SongListItemView({model: song}).render().el);
			}, this);
			
			return this;
        },
        
        renderAgain: function () {
        	this.$el.empty();
        	
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

