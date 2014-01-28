define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/Shell.html'),

        template = _.template(tpl),
        $menuItems;

    return Backbone.View.extend({

        initialize: function () {
        	console.log('Shell: init');
        },

        render: function () {
            this.$el.html(template());
            $menuItems = $('.navbar .nav li', this.el);
            return this;
        },

        events: {
            "keyup .search-query": "search",
            "keypress .search-query": "onkeypress"
        },

        search: function (event) {
        	var key = $('#searchText').val();
        	console.log('Shell: Search for '+key);
        },

        onkeypress: function (event) {
            if (event.keyCode === 13) { // enter key pressed
                event.preventDefault();
            }
        },

        selectMenuItem: function (menuItem) {
            $menuItems.removeClass('active');
            if (menuItem) {
                $('.' + menuItem).addClass('active');
            }
        }

    });

});