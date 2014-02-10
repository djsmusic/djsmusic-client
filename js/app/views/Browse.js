define(function (require) {

    "use strict";

    var $           	= require('jquery'),
        _        	   	= require('underscore'),
        Backbone    	= require('backbone'),
        tpl         	= require('text!tpl/Browse.html'),
        Songs			= require('app/collections/songs'),
        SongListView	= require('app/views/SongBigList'),
		Player			= require('app/views/Player'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(data){
    		console.log('Browse: init');
    		// Prepare list of songs
			this.songs = new Songs();
    		this.songs.fetch();
    		this.songList = new SongListView({collection : this.songs});
    	},
    	
    	events: {
    		'submit form' : 'filterKeyword',
			'click .playAll' : 'playAll',
			'change .filter' : 'filter'
    	},

        render: function () {
            this.$el.html(template());
            $('.searchResults').html(this.songList.render().el);
            return this;
        },
        
        search: function(){
        	this.songs.reset();
        	console.log('Browse: Search with params: ',this.songs.meta());
        	this.songs.fetch({
    			data: this.songs.meta(),
    			success: function(collection){
    				collection.trigger('fetched');
    			}
    		});
        },
        
        filter: function(e){
        	e.preventDefault();
        	this.songs.meta($(e.currentTarget).attr('name'), $(e.currentTarget).val());   	
        },
        
        filterKeyword: function(e){
        	e.preventDefault();
        	this.songs.meta('title', $('#searchQuery').val());   	
        },
        
        playAll: function(e){
        	e.preventDefault();
        	Player.addToPlaylist(this.songs);
        }

    });

});