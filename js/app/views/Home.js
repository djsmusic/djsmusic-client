define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        Songs				= require('app/models/song'),
        SongListView		= require('app/views/SongList'),
        tpl                 = require('text!tpl/Home.html'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(){
    		this.songs = new Songs.TopSongsCollection();
    		console.log('Initialize home view: ',this.songs);
    	},

        render: function () {
        	this.$el.html(template());
            
            this.songs.fetch().done(function(){
            	var listView = new SongListView({collection: self.songs, el: $('#top tbody', self.el)});
            	listView.render();
			});
            
            return this;
        }

    });

});