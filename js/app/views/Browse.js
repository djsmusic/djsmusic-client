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
    		// Search params
    		this.params = {};
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
            $('#search-results').append(this.songList.render().el);
            return this;
        },
        
        search: function(){
        	this.songs.reset();
        	var params = this.params;
        	console.log('Searching with params: ',params);
        	this.songs.fetch({
    			data: params,
    			success: function(collection){
    				collection.trigger('fetched');
    			}
    		});
        },
        
        filter: function(e){
        	e.preventDefault();
        	this.params[$(e.currentTarget).attr('name')] = $(e.currentTarget).val();  
        	this.search();     	
        },
        
        filterKeyword: function(e){
        	e.preventDefault();
        	this.params['title'] = $('#searchQuery').val();  
        	this.search();     	
        },
        
        playAll: function(e){
        	e.preventDefault();
        	Player.addToPlaylist(this.songs);
        }

    });

});