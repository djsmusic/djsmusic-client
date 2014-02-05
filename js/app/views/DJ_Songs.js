define(function (require) {

    "use strict";
    
    var $           	= require('jquery'),
        _           	= require('underscore'),
        Backbone    	= require('backbone'),
        tpl         	= require('text!tpl/DJ_Songs.html'),
        Player			= require('app/views/Player'),
        Display			= require('display'),
        Songs			= require('app/collections/songs'),
        Albums			= require('app/collections/albums'),
        SongListView	= require('app/views/SongList'),
        AlbumListView	= require('app/views/AlbumList'),
        Comments		= require('app/views/Comments'),
        Display			= require('display'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(data){
    		console.log('DJ Songs: init ID '+this.model.attributes.artist.id);
    		this.model.on("change", this.render);
    		// Artist ID
			var artistId = this.model.attributes.artist.id;
			// Search params
			this.params = {
				user: artistId
			};
			var params = this.params;
			// Get the artists songs
       		this.songs = new Songs();
    		this.songs.fetch({
    			data: params
    		});
    		// Get the artists albums
    		this.albums = new Albums();
    		this.albums.fetch({
    			data: {
    				user: artistId
    			},
    			success: function(mod,data){
    				console.log('Albums: Fetched ',data);
    			}
    		});
    		// Create new list views
    		this.songList = new SongListView({collection : this.songs});
    		this.albumList = new AlbumListView({collection : this.albums});
    		// Comments init
    		this.comments = new Comments();
    	},
    	
    	events: {
        	'click a.playAll' : 'playAllSongs',
        	'change .filter' : 'filter'
        },

        render: function () {
        	
        	this.model.attributes.artist.playsString = Display.number(this.model.attributes.artist.plays);
        	this.model.attributes.artist.downloadsString = Display.number(this.model.attributes.artist.downloads);
        	
        	this.$el.html(template(this.model.attributes));
        	
        	$('#songs').append(this.songList.render().el);
        	$('#albums').append(this.albumList.render().el);
        	
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