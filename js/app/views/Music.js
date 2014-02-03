define(function (require) {

    "use strict";
    
    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/Music.html'),
        Player		= require('app/views/Player'),
        Display		= require('display'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(){
    		console.log('Music: init');
    		this.model.on("change", this.render);
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
        	this.$el.html(template(attr));
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