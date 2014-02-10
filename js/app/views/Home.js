define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        Songs				= require('app/collections/songs'),
        SongListView		= require('app/views/SongList'),
        tpl                 = require('text!tpl/Home.html'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(){
    		console.log('Home: Init');
    		// Create the collections
    		this.topSongs = new Songs();
    		this.latestSongs = new Songs();
    		this.downloadedSongs = new Songs();
    		
    		// Fetch
    		this.topSongs.meta('orderby','best',0);
    		this.latestSongs.meta('orderby','release',0);
    		this.latestSongs.meta('orderby','downloads',0);
    		
    		// Create the lists
    		this.topSongsList = new SongListView({collection : this.topSongs});
    		this.latestSongsList = new SongListView({collection : this.latestSongs});
    		this.downloadedSongsList = new SongListView({collection : this.downloadedSongs});
    	},

        render: function () {
        	this.$el.html(template());
        	
        	$('#top-songs').append(this.topSongsList.render().el);
        	$('#latest-songs').append(this.latestSongsList.render().el);
        	$('#downloaded-songs').append(this.downloadedSongsList.render().el);
            
            return this;
        }

    });

});