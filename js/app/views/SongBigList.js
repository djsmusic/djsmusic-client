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
			if(typeof(current)==='undefined' || current < 1) current = 1;
			switch(type){
				case 'prev':
					current--;
					break;
				case 'next':
					current++;
					break;
			}
			if(current<2){
				current = 1;
				$('.pager li:first-child').addClass('disabled');
			}
			if(current>1) $('.pager li:first-child').removeClass('disabled');
			this.collection.meta('page',current);
			$('.pager small').text(current);
			
			return this;
        },
        
        filter: function(e){
        	console.log('BigList filter');
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

