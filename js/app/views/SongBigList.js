define(function (require) {

    "use strict";

    var $                       = require('jquery'),
        _                       = require('underscore'),
        Backbone                = require('backbone'),
        tpl                 	= require('text!tpl/SongBigList.html'),
        SongListItemView    	= require('app/views/SongBigListItem'),
        
        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function () {
        	console.log("SongBigList: Init");
        	
			this.collection.on("reset", this.renderAgain, this);
        	this.collection.on("fetched", this.check, this);
            this.collection.on("add", this.renderOne, this);
            this.collection.on("set:meta", this.setPage, this);
        },
        
        events: {
    		'change .BigListFilter' : 'filter',
    		'click .pager a' : 'paging'
    	},

        render: function () {
        	this.$el.empty().addClass('big-list').html(template());
        	
        	this.$list = this.$el.find('.SongBigList');
        	
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
        		$('.pager li:last-child').addClass('disabled');
        	}else{
        		$('.pager li:last-child').removeClass('disabled');
        	}
        	var page = this.collection.meta('page');
        	if(page<1) $('.pager li:first-child').addClass('disabled');
			if(page>0) $('.pager li:first-child').removeClass('disabled');
        	$('.pager small').text(page+1);
        },
        
        filter: function(e){
        	this.collection.meta('page', 0, false);
        	this.collection.meta($(e.currentTarget).attr('name'), $(e.currentTarget).val());
        	return this;   	
        },
        
        check: function(){
        	if(this.collection.length == 0){
				this.$list.html('<div class="media"><div class="alert alert-warning"><i class="fa fa-exclamation-triangle"></i> No results</div></div>');
			}
			return this;
        },
		       
		renderOne: function (model) {
			this.$list.append(new SongListItemView({model: model}).render().el);
			return this;
		}
    });

});

