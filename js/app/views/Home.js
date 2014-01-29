define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        Songs				= require('app/collections/songs'),
        SongListView		= require('app/views/SongList'),
        tpl                 = require('text!tpl/Home.html'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(){
    		this.songs = new Songs([],{type: 'top'});
    		console.log('Home: Init');
    		this.songList = new SongListView({collection : this.songs});
    	},

        render: function () {
        	this.$el.html(template());
        	
        	$('#top-songs').append(this.songList.render().el);
            
            return this;
        }

    });

});