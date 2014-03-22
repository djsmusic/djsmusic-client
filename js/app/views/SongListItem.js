define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/SongListItem.html'),
        Player				= require('app/views/Player'),
        Display				= require('display'),

        template = _.template(tpl);

    return Backbone.View.extend({

        tagName: "li",

        initialize: function () {
        	this.model.on("change", this.render, this);
        },

        render: function () {
        	this.$el.addClass('list-group-item');
        	if(typeof(this.model.attributes.track)!=='undefined'){
        		this.model.attributes.track.ratingStars = Display.rating(this.model.attributes.track.rating);
        		this.model.attributes.track.durationString = Display.timeToString(this.model.attributes.track.duration);
        		this.model.attributes.track.downloadsString = Display.number(this.model.attributes.track.downloads);
        		this.model.attributes.track.playsString = Display.number(this.model.attributes.track.plays);
        	}else{
        		console.warn('SongListItem: Track undefined:',this.model.attributes);
        	}
        	this.$el.html(template(this.model.attributes));
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