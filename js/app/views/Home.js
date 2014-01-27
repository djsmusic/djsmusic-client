define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        TopSongs			= require('app/collections/topSongs'),
        SongListView		= require('app/views/SongList'),
        tpl                 = require('text!tpl/Home.html'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(){
    		this.songs = new TopSongs([],{rating: 3});
    		console.log('Initialize home view with collection: ',this.songs);
    		this.songList = new SongListView({collection : this.songs});
    	},

        render: function () {
        	this.$el.html(template());
        	
        	console.log("Adding to DOM: ", this.songList.render().el);
        	$('#top-songs').append(this.songList.render().el);
        	
        	$('.nav-tabs a').click(function (e) {
				e.preventDefault();
				$(this).tab('show');
			});
            
            return this;
        }

    });

});