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

        template = _.template(tpl);
    
    var Player = Backbone.View.extend({
    	
    	playlist : [],		// Playlist, array of track objects
    	current: {},		// Current track object
    	state : 1,			// 0 => Pause, 1 => Playing

        initialize: function () {
        	console.log('Player: init');
        	
        	soundManager.setup({
				url: '../../soundmanager/swf/',
				flashVersion: 8,
				debugMode: false
			});
			
			// Almost always there will be a timeout on the first try
			// this is due to the load order in RequireJS I believe.
			soundManager.ontimeout(function(status) {
				soundManager.flashLoadTimeout = 0;	// Wait infinitely for flash, then restart
				soundManager.onerror = {}; 			// Prevent an infinite loop, in case it's not flashblock
				soundManager.reboot();				// and, go!
			});
        },

        render: function () {
        	this.$el.html(template());
        	
        	this.$loaded = this.$el.find('.seek-loaded');
			this.$songInfo = this.$el.find('.song-info');
        	this.$elapsed = this.$el.find('.elapsed');
        	this.$total = this.$el.find('.total');
        	this.$playlist = this.$el.find('.playlist');
        	this.$next = this.$el.find('.next');
        	this.$prev = this.$el.find('.previous');
        	
        	var this_ = this;
        	
        	this.slider = this.$el.find('input.seek-slider').slider({
        		formater : function(val){
        			if(typeof(this_.current)==='undefined' || typeof(this_.current.duration)==='undefined'){
        				this_.current.duration = 0;
        			}
        			var total = this_.current.duration/1000, // Total time in seconds
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
        	"click .playlist a.delete": "removeTrack",
        	"mouseover .playlist li" : "overTrack",
        	"mouseout .playlist li" : "outTrack"
        },
        
        /**
         * Add a track to the playlist 
         */
        addToPlaylist: function(track){
        	
        	this.show();
        	
        	var this_ = this;
        	
        	console.log('Player: Adding to playlist: ', track);
        	
        	soundManager.onready(function(){
        		// Check if it's playable
				if(soundManager.canPlayURL(track.url)){
					
					track.title += '-'+this_.playlist.length;
					
					track.sound = soundManager.createSound({
						url: track.url,
						id: track.url+'-'+this_.playlist.length,
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
							this_.$total.text(timeToString(this_.current.duration/1000));
						}
					});
					
					// Display in the playlist
					track.$obj = $('<li><a class="track" href="#music/'+track.songId+'" title="'+track.title+'" rel="'+this_.playlist.length+'"></a><a class="delete" aria-hidden="true" rel="'+this_.playlist.length+'" title="Remove from playlist"><i class="fa fa-times-circle"></i></a></li>').appendTo($(this_.$playlist).find('ul'));
					
					// Store in playlist
					this_.playlist.push(track);
					
					// Update the next button status
					if(this_.current.index < this_.playlist.length-1){
						this_.enable(this_.$next);
					}else{
						this_.disable(this_.$next);
					}
					
					// Load in the player if it's the only song
					if(this_.playlist.length == 1){
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
			
			if(this.playlist.length==0){
				console.error('Player: Playlist is empty');
				return;
			}
			
			this.current = this.playlist[0]; // We read from the start
			this.current.index = 0;
			
			this.playCurrent();
		},
		/**
		 * Play the previous song in the playlist 
		 */
		prev: function(){
			console.log('Player: Prev');
			
			if(this.playlist.length < 2 || typeof(this.current.index)==='undefined'){
				console.error('Player: Playlist is empty');
				this.disable($prev);
				return;
			}
			
			var index = this.current.index-1;
			
			this.current = this.playlist[index];
			this.current.index = index;
			
			this.playCurrent();
		},
		/**
		 * Enables an element 
		 */
		enable: function($obj){
			$obj.removeClass('disabled');
		},
		/*
		 *  Disables an element
		 */
		disable: function($obj){
			$obj.addClass('disabled');
		},
		/**
		 * Plays the selected object from the playlist 
		 */
		playTrack: function(e){
			e.preventDefault();
			var index = $(e.currentTarget).attr('rel');
			this.current = this.playlist[index];
			
			// Rewind the track in case it was already listened
			this.current.sound.setPosition(0);
			
			this.playCurrent();
		},
		/**
		 * Remove the selected track from the playlist 
		 */
		removeTrack: function(e){
			e.preventDefault();
			var index = $(e.currentTarget).attr('rel'),
				item = this.playlist[index];
			item.$obj.remove();
			delete this.playlist[index];
		},
		/**
		 * Play the track in current 
		 */
		playCurrent: function(){
			// Add the active class
			this.$playlist.find('a.active').removeClass('active');
			this.current.$obj.find('a.track').addClass('active');
			
			console.log('Playlist size: '+this.playlist.length);
			
			// Enable/Disable next/prev buttons
			if(this.current.index > 0){
				this.enable(this.$prev);
			}else{
				this.disable(this.$prev);
			}
			if(this.current.index < this.playlist.length-1){
				this.enable(this.$next);
			}else{
				this.disable(this.$next);
			}
			
			this.$songInfo.html('<a href="#music/'+this.current.songId+'">'+this.current.title+'</a> <small>by <a href="#dj-songs/'+this.current.artistId+'">'+this.current.artist+'</a></small>');
			
			// Start playing
			this.play();
		},
		/**
		 * Toggle the state of the player. Always according to what the sound library says.
		 * Also update the internal 'state' variable 
		 */
		playPause: function(){
			var icon;
			if(!this.ready()){
				console.warn('Player: Sound not ready: ',this.current);
				return;
			}
			if(this.state==0){
				this.play();
			}else{
				this.pause();
			}
		},
		/**
		 * Play current sound, after pausing all. Just in case.
		 */
		play: function(){
			soundManager.pauseAll();
			this.current.sound.play();
			console.log('Player: Now Playing');
			this.state = 1;
			this.$el.find("a.playPause i").removeClass('fa-play').addClass('fa-pause');
		},
		/**
		 * Pause all sounds. Just in case. 
		 */
		pause: function(){
			soundManager.pauseAll();
			console.log('Player: Now Paused');
			this.state = 0;
			this.$el.find("a.playPause i").removeClass('fa-pause').addClass('fa-play');
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
			if(typeof(this.current.sound)=='object'){
				return true;
			}
			return false;
		},
		/**
		 * Triggered when the mouse is over a track.
		 * Displays the delete button
		 */
		overTrack: function(e){
			var $obj = $(e.currentTarget);
			$obj.find('a.delete').show();
		},
		/**
		 *  Triggered on mouse out. Hides the delete button
 		 * @param {Object} event
		 */
		outTrack: function(e){
			var $obj = $(e.currentTarget);
			
			$obj.find('a.delete').hide();
		},
		/**
		 *  Resets the player:
		 *  Restore the song info, reset the seek bar
		 *  And the timers.
		 */
		resetPlayer: function(){
			this.$songInfo.html('');
			this.setLoaded(0);
			this.setPlayed(0);
			this.$elapsed.text('00:00');
			this.$total.text('00:00');
			this.current.sound.destruct();
			this.current = {};
		}
    });
    
    return new Player();

});