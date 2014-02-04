define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/SongBigListItem.html'),
        Player				= require('app/views/Player'),
        Display				= require('display'),

        template = _.template(tpl);

    return Backbone.View.extend({

        tagName: "div",

        initialize: function () {
        	this.model.on("change", this.render, this);
        },

        render: function () {
        	// Set the appropriate classes for the element
        	this.$el.addClass('row').addClass('top-m');
        	// Parse data
        	this.model.attributes.track.ratingStars = Display.rating(this.model.attributes.track.rating);
        	this.model.attributes.track.durationString = Display.timeToString(this.model.attributes.track.duration);
        	var tags = '';
        	for(var i=0;i<this.model.attributes.track.tags.length;i++){
        		tags += '<span class="label label-default">'+this.model.attributes.track.tags[i]+'</span> ';
        	}
        	this.model.attributes.track.tagsLabels = tags;
        	// Render
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