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
    	random: false,		// Random mode
    	repeat: false,		// Repeat mode

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
        		enabled: false,
        		formater : function(val){
        			if(typeof(this_.current)==='undefined' || typeof(this_.current.duration)==='undefined'){
        				this_.current.duration = 0;
        			}
        			var total = this_.current.duration/1000, // Total time in seconds
        				elapsed = total * val / 1000;
        			return timeToString(elapsed);
        		}
        	}).on('slideStart',function(){
        		// Set up a flag to prevent the seeker to be moved
        		// if it's on play state.
        		this_.slider.sliding = true;
        	}).on('slideStop',function(slide){
        		if(this_.ready()){
        			var pos = slide.value;
        			this_.current.sound.setPosition(this_.current.duration * pos/1000);
        			this_.$elapsed.text(timeToString(pos/1000));
        			this_.slider.sliding = false;
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
        	"click .playlist a.track": "clickedTrack",
        	"click .playlist a.delete": "removeTrack",
        	"mouseover .playlist li" : "overTrack",
        	"mouseout .playlist li" : "outTrack"
        },
        
        /**
         * Add a track to the playlist
         * @param (Object) Backbone song model
         */
        addToPlaylist: function(track){
        	
        	if(track instanceof Backbone.Model){
				console.log('Player: Received model, all fine');
				track = track.attributes;
			}else if(track instanceof Backbone.Collection){
				console.log('Player: Received Collection, not ready');
				return;
			}
			   	
        	this.show();
        	
        	var this_ = this;
        	
        	console.log('Player: Adding to playlist: ', track);
        	
        	soundManager.onready(function(){
        		// Check if it's playable
				if(soundManager.canPlayURL(track.url)){
					
					track.title += '-'+this_.playlist.length;
					track.played = false;	// Played flag, used by the random mode
					
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
					track.$obj = $('<li><a class="track" href="#music/'+track.songId+'" title="'+track.title+'" data-toggle="tooltip"></a><a class="delete" aria-hidden="true" title="Remove from playlist" data-toggle="tooltip" data-placement="top"><i class="fa fa-times-circle"></i></a></li>').appendTo($(this_.$playlist).find('ul'));
					// Add the tooltip
					track.$obj.find('a.track').tooltip({
						delay: { show: 250, hide: 0 }
					});
					
					// Store in playlist
					this_.playlist.push(track);
					
					if(typeof(this_.current.index)==='undefined'){
						this_.current.index = -1;
					}
					
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
			
			// Select the normal next index
			var index = this.current.index+1;
			
			// Check random and repeat modes
			if(this.random && this.playlist.length > 1){
				// Select a random track and play it
				// Different from the current one
				index = Math.floor(Math.random()*this.playlist.length);
				var initial = index;
				while(index == this.current.index || this.playlist[index].played){
					// Chose another one until it's different and it wasn't already played
					index++;
					if(index == initial){
						// Already looped through all tracks!
						console.error('Player: No next track');
						return false;
					}
					if(typeof(this.playlist[index]) === 'undefined'){
						index = 0; // Start over
					}
				}
				this.playTrack(index);
				
				// Check if there are any more available
				var available = false;
				for(var i=0;i<this.playlist.length;i++){
					if(!this.playlist[i].played){
						available = true;
						break;
					}
				}
				if(!available){
					// No more tracks available. Since the user wants to go to next
					// reset the status and keep looping.
					this.resetPlayed();
				}
				
				return true;
			}
			
			// Make sure it's valid
			if(typeof(this.playlist[index]) === 'undefined'){
				if(this.repeat){
					index = 0;
				}else{
					console.error('Player: No next track');
					return false;
				}
			}
			
			this.playTrack(index);
			
			return true;
		},
		/**
		 * Play the previous song in the playlist 
		 */
		prev: function(){
			console.log('Player: Prev');
			
			var index = this.current.index-1;
			
			if(typeof(this.playlist[index]) === 'undefined'){
				console.error('Player: No prev track');
				return false;
			}
			
			this.playTrack(index);
			
			return true;
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
		 * Takes the current track to the beginning 
		 */
		rewind: function(){
			this.current.sound.setPosition(0);
			this.setPlayed(0);
			this.$elapsed.text('00:00');
		},
		/**
		 * Plays the clicked tracked from the playlist 
		 */
		clickedTrack: function(e){
			e.preventDefault();
			var index = $(e.currentTarget).parent('li').index('.playlist li');
			this.playTrack(index);
		},
		/**
		 * Plays the selected object from the playlist 
		 */
		playTrack: function(index){
			this.current = this.playlist[index];
			this.current.index = index;
						
			// Rewind the track in case it was already listened
			this.rewind();
			
			this.playCurrent();
		},
		/**
		 * Remove the selected track from the playlist 
		 */
		removeTrack: function(e){
			e.preventDefault();
			var index = $(e.currentTarget).parent('li').index('.playlist li'),
				item = this.playlist[index];
			item.$obj.remove();
			this.playlist.splice(index,1);
		},
		/**
		 * Play the track in current 
		 */
		playCurrent: function(){
			// Add the active class
			this.$playlist.find('a.active').removeClass('active');
			this.current.$obj.find('a.track').addClass('active');
			
			// Enable/Disable next/prev buttons
			if(this.current.index > 0){
				this.enable(this.$prev);
			}else{
				this.disable(this.$prev);
			}
			if(this.current.index < this.playlist.length-1){
				this.enable(this.$next);
			}else if(!this.random && !this.repeat){
				this.disable(this.$next);
			}
			
			this.slider.slider('enable');
			
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
			var this_ = this;
			this.current.sound.play({
				onfinish: function() {
					// The current sound has finished.
					if(this_.playlist.length==0){
						// Only one element in the playlist
						this_.pause();
						this_.rewind();
						return;
					}
					// Try to play the next track
					if(!this_.next()){
						// Check repeat mode
						if(this_.repeat){
							this_.playTrack(0);
							return;
						}
						this_.pause();
						this_.rewind();
					}
				}
			});
			// Set the played flag of the current sound to true.
			// This flag is used by the random mode to avoid repeating the same tracks
			this.current.played = true;
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
				this.random = false;
				console.log('Player: Random mode OFF');
			}else{
				$random.addClass('active');
				this.random = true;
				// Reset all the played status
				this.resetPlayed();
				this.enable(this.$next);
				console.log('Player: Random mode ON');
			}
		},
		/**
		 * Resets the played status of all tracks in the playlist 
		 */
		resetPlayed: function(){
			for(var i=0;i<this.playlist.length;i++){
				this.playlist[i].played = false;
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
				this.repeat = false;
				console.log('Player: Repeat mode OFF');
			}else{
				$repeat.addClass('active');
				this.repeat = true;
				this.enable(this.$next);
				console.log('Player: Repeat mode ON');
			}
		},
		/**
		 * Sets the played percentage only if it's not being moved.
		 */
		setPlayed: function(percent){
			if(this.slider.sliding) return;
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
		 * Triggered on mouse out. Hides the delete button
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