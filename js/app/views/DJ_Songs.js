define(function (require) {

    "use strict";
    
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/DJ_Songs.html'),
        Player		= require('app/views/Player'),
        Display		= require('display'),
        Songs		= require('app/collections/songs'),
        SongListView		= require('app/views/SongList'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(data){
    		console.log('DJ Songs: init ID '+this.model.attributes.artist.id);
    		this.model.on("change", this.render);
    		// Request the list of songs in the album
			var artistId = this.model.attributes.artist.id;
       		this.songs = new Songs();
    		this.songs.fetch({
    			data: {
    				user: artistId
    			}
    		});
    		this.songList = new SongListView({collection : this.songs});
    	},

        render: function () {
        	this.$el.html(template(this.model.attributes));
        	
        	$('#songs').append(this.songList.render().el);
        	
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