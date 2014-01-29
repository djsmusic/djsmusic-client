define(function (require) {

    "use strict";

	function timeToString(time){
    	var sec_num = time;
	    var minutes = Math.floor(sec_num / 60);
	    var seconds = Math.floor(sec_num - (minutes * 60));
	
	    if (minutes < 10) {minutes = "0"+minutes;}
	    if (seconds < 10) {seconds = "0"+seconds;}
	    var time    = minutes+':'+seconds;
	    return time;
    }

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Player.html'),
        soundManager		= require('soundmanager2'),
        Slider				= require('slider'),
        
        playlist			= [],			// Playlist, array of track objects
		current 			= {},			// Current track object
		state 				= 1,			// 0 => Pause, 1 => Playing

        template = _.template(tpl);
    
    return Backbone.View.extend({

        initialize: function () {
        	console.log('Player: init');
        	
        	soundManager.setup({
				url: '../../soundmanager/swf/',
				flashVersion: 8
			});
        },

        render: function () {
        	this.$el.html(template());
        	
        	this.$loaded = this.$el.find('.seek-loaded');
        	this.$songInfo = this.$el.find('.song-info');
        	
        	var this_ = this;
        	
        	this.slider = this.$el.find('input.seek-slider').slider({
        		formater : function(val){
        			if(typeof(current.length)==='undefined'){
        				current.length = 0;
        			}
        			var total = current.length, // Total time in seconds
        				elapsed = total * val / 1000;
        			return timeToString(elapsed);
        		}
        	});
        	       	
            return this;
        },

        events: {
        	"click .playPause": "playPause",
        	"click .previous": "prev",
        	"click .next": "next",
        	"click .random": "toggleRandom",
        	"click .repeat": "toggleRepeat"
        },
        
        /**
         * Add a track to the playlist 
         */
        addToPlaylist: function(track){
        	
        	var this_ = this;
        	
        	console.log('Player: Trying to add to playlist: ', track);
        	soundManager.onready(function(){
        		// Check if it's playable
				if(soundManager.canPlayURL(track.url)){
					
					track.sound = soundManager.createSound({
						url: track.url,
						id: track.url,
						autoPlay: false,
						autoLoad: true
					});
					/*// Start loading it and display the progress
					track.sound.whileloading(function(){
						var percent = this.bytesLoaded*100/this.bytesTotal;
						console.log('Player: Loaded '+percent+'%');
					});*/
					
					// Store in playlist
					playlist.push(track);
					
					console.log('Player: Song added to playlist: ',track);
					
					// Load in the player if it's the only song
					if(playlist.length == 1){
		        		this_.next();
		        	}
				}else{
					console.error('Player: Cant play track: ',track.url);
				}
			});
        	
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
			console.log('Player: Next');
			
			if(playlist.length==0){
				console.error('Player: Playlist is empty');
				return;
			}
			
			current = playlist.pop();
			
			console.log(this.$songInfo);
			
			// I need to load the song in soundmanager
			// and its data (title and artist) in the player
			this.$songInfo.html('<a href="#music/'+current.songId+'">'+current.title+'</a> <small>by <a href="#dj-songs/'+current.artistId+'">'+current.artist+'</a></small>');
		},
		/**
		 * Play the previous song in the playlist 
		 */
		prev: function(){
			console.log('Player: Prev');
		},
		/**
		 * Toggle the state of the player. Always according to what the sound library says.
		 * Also update the internal 'state' variable 
		 */
		playPause: function(){
			var icon;
			if(!this.ready()){
				console.warn('Player: Sound not ready: ',current);
				return;
			}
			if(state==0){
				this.$el.find("a.playPause i").removeClass('fa-pause').addClass('fa-play');
				state = 1;
				current.sound.pause();
				console.log('Player: Now Paused');
			}else{
				this.$el.find("a.playPause i").removeClass('fa-play').addClass('fa-pause');
				state = 0;
				current.sound.play();
				console.log('Player: Now Playing');
			}
		},
		/**
		 * Toggle random mode
		 */
		toggleRandom: function(){
			var $random = this.$el.find("a.random");
			if($random.hasClass('active')){
				// Disable random mode
				$random.removeClass('active');
				console.log('Player: Random mode OFF');
			}else{
				$random.addClass('active');
				console.log('Player: Random mode ON');
			}
		},
		/**
		 * Toggle repeat mode
		 */
		toggleRepeat: function(){
			var $repeat = this.$el.find("a.repeat");
			if($repeat.hasClass('active')){
				// Disable random mode
				$repeat.removeClass('active');
				console.log('Player: Repeat mode OFF');
			}else{
				$repeat.addClass('active');
				console.log('Player: Repeat mode ON');
			}
		},
		/**
		 * Sets the loaded percentage 
		 */
		setLoaded: function(percent){
			this.$loaded.width(percent+'%');
		},
		/**
		 * Returns whether current is holding a valid song to play 
		 */
		ready: function(){
			if(typeof(current.sound)=='object'){
				return true;
			}
			return false;
		}

    });

});