define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        SongListView		= require('app/views/SongList'),
        tpl                 = require('text!tpl/Home.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        /*render: function () {
            this.$el.html(template());
            return this;
        },*/
        
        render: function () {
        	console.log('Home view: ',this.model);
            this.$el.html(template(this.model.attributes));
            console.log("About to fetch");
            this.model.topSongs.fetch({
            	rating: 3,
                success: function (data) {
                    if (data.length === 0) {
                        $('.no-reports').show();
                    }
                }
            });
            var listView = new SongListView({collection: this.model.topSongs, el: $('#top tbody', this.el)});
            listView.render();
            return this;
        }

    });

});