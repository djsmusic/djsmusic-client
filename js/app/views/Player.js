define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Player.html'),
        sound				= require('sound'),
        
        playlist			= [],			// Playlist, array of track objects
		current 			= null,			// Current track object
		state 				= 1,			// 0 => Pause, 1 => Playing

        template = _.template(tpl);

    return Backbone.View.extend({

        initialize: function () {
        	console.log('Player: init');
        },

        render: function () {
        	this.$el.html(template());
            return this;
        },

        events: {
        	"click .playPause": "playPause",
        },
        
        /**
		 * Show the player 
		 */
		show: function(){
			$('#player').show();
		},
		/**
		 * Hide the player 
		 */
		hide: function(){
			$('#player').hide();
		},
		/**
		 * Play the next song in the playlist 
		 */
		next: function(){
			console.log('Next');
		},
		/**
		 * Play the previous song in the playlist 
		 */
		prev: function(){
			console.log('Prev');
		},
		/**
		 * Toggle the state of the player. Always according to what the sound library says.
		 * Also update the internal 'state' variable 
		 */
		playPause: function(){
			var icon;
			if(state==0){
				this.$el.find("a.playPause i").removeClass('fa-pause').addClass('fa-play');
				state = 1;
				console.log('Player: Now Paused');
			}else{
				this.$el.find("a.playPause i").removeClass('fa-play').addClass('fa-pause');
				state = 0;
				console.log('Player: Now Playing');
			}
		}

    });

});