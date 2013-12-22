define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        TopSongs			= require('app/collections/topSongs'),
        SongListView		= require('app/views/SongList'),
        tpl                 = require('text!tpl/Home.html'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(){
    		this.songs = new TopSongs([],{rating: 3});
    		console.log('Initialize home view: ',this.songs);
    		var songList = new SongListView({collection : this.songs});
    	},

        render: function () {
        	this.$el.html(template());
            
            return this;
        }

    });

});