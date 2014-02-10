define(function (require) {

    "use strict";

    var $                       = require('jquery'),
        _                       = require('underscore'),
        Backbone                = require('backbone'),
        tpl                 	= require('text!tpl/SongList.html'),
        SongListItemView    	= require('app/views/SongListItem'),
        
        template = _.template(tpl);

	return Backbone.View.extend({
		
		initialize: function () {
			console.log("SongList: Init");
			
			this.collection.on("reset", this.renderAgain, this);
			this.collection.on("fetched", this.fetched, this);
			this.collection.on("add", this.renderOne, this);
			this.collection.on("set:meta", this.setPage, this);
		},
		
		events: {
    		'click .pager a' : 'paging'
    	},
		
		render: function () {
			this.$el.addClass('song-list').html(template());
			
			this.$pagerText = this.$el.find('.pager small');
			this.$pagerNext = this.$el.find('.pager li:last-child');
			this.$pagerPrev = this.$el.find('.pager li:first-child');
			
			this.$list = this.$el.find('.SongList');
			
			_.each(this.collection.models, function (song) {
				this.$list.append(new SongListItemView({model: song}).render().el);
			}, this);
			
			return this;
		},
		
		renderAgain: function () {
        	this.$list.empty();
        	
        	_.each(this.collection.models, function (song) {
				this.$list.append(new SongListItemView({model: song}).render().el);
			}, this);
            
            return this;
        },
		
		paging: function(e){
			e.preventDefault();
			console.log('SongList: Change page');
        	var type = $(e.currentTarget).attr('rel'),
				current = this.collection.meta('page');
			if(typeof(current)==='undefined' || current < 0) current = 0;
			switch(type){
				case 'prev':
					current--;
					break;
				case 'next':
					current++;
					break;
			}
			if(current<0) current = 0;
			this.collection.meta('page',current);
			
			return this;
        },
        
        setPage: function(){
        	// First check if this might be the last page
        	// I need to somehow get that 10 from somewhere.
        	if(this.collection.length < 10){
        		// This is the last page
        		this.$pagerNext.addClass('disabled');
        	}else{
        		this.$pagerNext.removeClass('disabled');
        	}
        	var page = this.collection.meta('page');
        	if(page<1) this.$pagerPrev.addClass('disabled');
			if(page>0) this.$pagerPrev.removeClass('disabled');
			this.$pagerText.text(page+1);
        },
		
		fetched: function(){
			if(this.collection.length == 0){
				this.$list.append('<li class="media"><div class="alert alert-warning">No results</div></li>');
			}
			return this;
		},
		       
		renderOne: function (model) {
			this.$list.append(new SongListItemView({model: model}).render().el);
			return this;
		}
	});

});

