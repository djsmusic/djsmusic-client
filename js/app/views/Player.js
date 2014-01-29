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
    
    var Player = Backbone.View.extend({

        initialize: function () {
        	console.log('Player: init');
        	
        	soundManager.setup({
				url: '../../soundmanager/swf/',
				flashVersion: 8
			});
			
			soundManager.ontimeout(function(status) {
				console.error('Player: Timeout loading soundManager. Status: '+status.success+'. Error type: '+ status.error.type);
				// Retry
				soundManager.setup({
					url: '../../soundmanager/swf/',
					flashVersion: 8
				});
			});
        },

        render: function () {
        	this.$el.html(template());
        	
        	this.$loaded = this.$el.find('.seek-loaded');
        	this.$songInfo = this.$el.find('.song-info');
        	this.$elapsed = this.$el.find('.elapsed');
        	this.$total = this.$el.find('.total');
        	this.$playlist = this.$el.find('.playlist');
        	
        	var this_ = this;
        	
        	this.slider = this.$el.find('input.seek-slider').slider({
        		formater : function(val){
        			if(typeof(current.duration)==='undefined'){
        				current.duration = 0;
        			}
        			var total = current.duration/1000, // Total time in seconds
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
        	"click .repeat": "toggleRepeat",
        	"click .playlist a.track": "playTrack",
        	"click .playlist a.delete": "removeTrack"
        },
        
        /**
         * Add a track to the playlist 
         */
        addToPlaylist: function(track){
        	
        	this.show();
        	
        	var this_ = this;
        	
        	console.log('Player: Trying to add to playlist: ', track);
        	
        	soundManager.onready(function(){
        		// Check if it's playable
				if(soundManager.canPlayURL(track.url)){
					
					track.sound = soundManager.createSound({
						url: track.url,
						id: track.url,
						autoPlay: false,
						autoLoad: false,
						whileloading: function(){
							var percent = this.bytesLoaded*100/this.bytesTotal;
							this_.setLoaded(percent);
						},
						whileplaying: function(){
							var percent = this.position*100/this.duration;
							this_.setPlayed(percent);
							this_.$elapsed.text(timeToString(this.position/1000));
						},
						onload: function(){
							console.log('Player: Track loaded: '+track.title);
							track.duration = this.duration;
							this_.$total.text(timeToString(current.duration/1000));
						}
					});
					
					
					// Display in the playlist
					track.$obj = $('<li><a class="track" href="#music/'+track.songId+'" title="'+track.title+'" rel="'+playlist.length+'"></a><a class="delete" aria-hidden="true" rel="'+playlist.length+'" title="Remove from playlist"><i class="fa fa-times-circle"></i></a></li>').appendTo($(this_.$playlist).find('ul'));
					
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
			$('#player').removeClass('hidden').show();
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
			
			this.playCurrent();
		},
		/**
		 * Plays the selected object from the playlist 
		 */
		playTrack: function(e){
			e.preventDefault();
			var index = $(e.currentTarget).attr('rel');
			current = playlist[index];
			
			this.playCurrent();
		},
		/**
		 * Remove the selected track from the playlist 
		 */
		removeTrack: function(e){
			e.preventDefault();
			var index = $(e.currentTarget).attr('rel');
			item = playlist[index];
			item.$obj.remove();
			playlist.splice(index,1);
		},
		/**
		 * Play the track in current 
		 */
		playCurrent: function(){
			// Add the active class
			this.$playlist.find('a.active').removeClass('active');
			
			current.$obj.find('a').addClass('active');
			
			this.$songInfo.html('<a href="#music/'+current.songId+'">'+current.title+'</a> <small>by <a href="#dj-songs/'+current.artistId+'">'+current.artist+'</a></small>');
			
			// Start playing
			this.playPause();
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
		 * Sets the played percentage 
		 */
		setPlayed: function(percent){
			this.slider.slider('setValue', percent*10);
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
    
    return new Player();

});