define(function (require) {

    "use strict";
    
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/Album.html'),
        Player		= require('app/views/Player'),
        Display		= require('display'),
        Songs		= require('app/collections/songs'),
        SongListView		= require('app/views/SongList'),
        Comments	= require('app/views/Comments'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(data){
    		console.log('Album: init ID '+this.model.attributes.album.id);
    		this.model.on("change", this.render);
    		// Request the list of songs in the album
			var albumId = this.model.attributes.album.id;
			// Search params
			this.params = {
				album: albumId
			};
			var params = this.params;
			// Song list
       		this.songs = new Songs();
    		this.songs.fetch({
    			data: params
    		});
    		this.songList = new SongListView({collection : this.songs});
    		this.comments = new Comments();
    	},
    	
    	events: {
        	'click a.playAll' : 'playAllSongs',
        	'change .filter' : 'filter'
        },

        render: function () {
        	this.model.attributes.album.playsString = Display.number(this.model.attributes.album.plays);
        	this.model.attributes.album.downloadsString = Display.number(this.model.attributes.album.downloads);
        	
        	this.$el.html(template(this.model.attributes));
        	
        	$('#songs').append(this.songList.render().el);
        	
        	// Display comment box
        	$('#comments').html(this.comments.render().el);
        	
            return this;
        },
        
        filter: function(e){
        	e.preventDefault();
        	this.params[$(e.currentTarget).attr('name')] = $(e.currentTarget).val();  
        	this.songs.reset();
        	var params = this.params;
        	console.log('Searching with ',params);
        	this.songs.fetch({
    			data: params,
    			success: function(collection){
    				collection.trigger('fetched');
    			}
    		}); 	
        },
        
        playAllSongs: function(e){
        	e.preventDefault();
        	
        	Player.addToPlaylist(this.songs);
        }

    });

});