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
       		this.songs = new Songs();
    		this.songs.fetch({
    			data: {
    				album: albumId
    			}
    		});
    		this.songList = new SongListView({collection : this.songs});
    		this.comments = new Comments();
    	},

        render: function () {
        	this.$el.html(template(this.model.attributes));
        	
        	$('#songs').append(this.songList.render().el);
        	
        	// Display comment box
        	$('#comments').html(this.comments.render().el);
        	
            return this;
        },
        
        events: {
        	'click a.playAll' : 'playAllSongs'
        },
        
        playAllSongs: function(e){
        	e.preventDefault();
        	
        	Player.addToPlaylist(this.songs);
        }

    });

});