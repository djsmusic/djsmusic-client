define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        Player				= require('app/views/Player'),
        tpl                 = require('text!tpl/Shell.html'),

        template = _.template(tpl),
        $menuItems;

    return Backbone.View.extend({

        initialize: function () {
        	this.Player = Player;
        	console.log('Shell: init');
        },

        render: function () {
            this.$el.html(template());
            $menuItems = $('.navbar .nav li', this.el);
            $('#player').append(this.Player.render().el);
            
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
        
        deselectMenuItems: function(){
        	$menuItems.removeClass('active');
        },
        
        selectMenuItem: function (menuItem) {
            this.deselectMenuItems();
            
            if (menuItem) {
                $('.' + menuItem).addClass('active');
            }
        }

    });

});