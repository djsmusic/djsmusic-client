define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/SongListItem.html'),
        Player				= require('app/views/Player'),

        template = _.template(tpl);

    return Backbone.View.extend({

        tagName: "tr",

        initialize: function () {
        	this.Player = Player;
            this.model.on("change", this.render, this);
        },

        render: function () {
        	this.$el.html(template(this.model.attributes));
            return this;
        },
        
        events: {
        	'click a.song' : 'playSong'
        },
        
        playSong: function(e){
        	e.preventDefault();
        	// Dummy track to test
        	var song = {
        		title : 'Welcome to the club Remix',
        		artist: 'DJ Bassenergy',
        		songId: 1,
        		artistId: 1,
        		url: 'http://songs.djs-music.com/26-19-C5sJG6f8em.mp3'
        	}; 
            
            this.Player.addToPlaylist(song);
        }

    });

});