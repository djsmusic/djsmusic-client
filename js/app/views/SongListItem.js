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
        	this.model.attributes.track.ratingStars = Display.rating(this.model.attributes.track.rating);
        	this.model.attributes.track.durationString = Display.timeToString(this.model.attributes.track.duration);
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