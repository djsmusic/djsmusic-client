define(function (require) {

    "use strict";
    
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/Music.html'),
        Player		= require('app/views/Player'),
        Display		= require('display'),
        Comments	= require('app/views/Comments'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(){
    		console.log('Music: init');
    		this.comments = new Comments();
    		this.model.on("change", this.render, this);
    	},

        render: function () {
        	// Process the tags
        	var tags = '',
        		attr = this.model.attributes;
        	for(var i=0;i<attr.track.tags.length;i++){
        		tags += '<span class="label label-default">'+attr.track.tags[i]+'</span> ';
        	}
        	attr.track.tags = tags;
        	attr.track.duration = Display.timeToString(attr.track.duration);
        	attr.track.rating = Display.rating(attr.track.rating);
        	attr.track.plays = Display.number(attr.track.plays);
        	attr.track.downloads = Display.number(attr.track.downloads);
        	
        	this.$el.html(template(attr));
        	
        	// Display comment box
        	$('#comments').html(this.comments.render().el);
            return this;
        },
        
        events: {
        	'click a.play' : 'playSong'
        },
        
        playSong: function(e){
        	e.preventDefault();
        	
        	Player.addToPlaylist(this.model);
        }

    });

});