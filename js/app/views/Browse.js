define(function (require) {

    "use strict";

    var $           	= require('jquery'),
        _        	   	= require('underscore'),
        Backbone    	= require('backbone'),
        tpl         	= require('text!tpl/Browse.html'),
        Songs			= require('app/collections/songs'),
        SongListView	= require('app/views/SongBigList'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(data){
    		console.log('Browse: init');
    		
    		// Prepare list of songs
			this.songs = new Songs();
    		this.songs.fetch({
    			data: {}
    		});
    		this.songList = new SongListView({collection : this.songs});
    	},

        render: function () {
            this.$el.html(template());
            $('#search-results').append(this.songList.render().el);
            return this;
        }

    });

});