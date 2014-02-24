define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        Player				= require('app/views/Player'),
        Songs				= require('app/collections/songs'),
        SongList			= require('app/views/SongSmallList'),
        tpl                 = require('text!tpl/Shell.html'),
        App					= require('app/app'),

		template = _.template(tpl),
        $menuItems;

    return Backbone.View.extend({

        initialize: function () {
        	this.Player = Player;
        	console.log('Shell: init');
        	
        	// Dropdown search
        	this.searchResults = new Songs();
        	this.searchresultsView = new SongList({collection: this.searchResults});
        	this.searchTimer = false;
        },

        render: function () {
            this.$el.html(template());
            $menuItems = $('.navbar .nav li', this.el);
            // Render the player
            $('#player').append(this.Player.render().el);
            
            $('.navbar-search', this.el).append(this.searchresultsView.render().el);
            
            this.$loader = this.$el.find('form .fa-spin');
            
            return this;
        },

        events: {
            "keyup .search-query": "typed",
            "keypress .search-query": "onkeypress"
        },

        typed: function (event) {
        	// Prevent too small searches
        	var key = $('#searchText').val(),
        		this_ = this;
        	if(key.length<3) return;
        	// Wait while user types
        	clearTimeout(this.searchTimer);
        	this.searchTimer = setTimeout(function(){
        		this_.search(key);
        	},50);
        },
        
        search: function(text){
        	this.startSearching();
        	var this_ = this;
        	this.searchResults.fetch({
        		reset: true,
        		data: {
        			title: text,
        			items: 6
        		},
        		success: function(){
        			this_.endSearching();
        		}
        	});
        	setTimeout(function () {
	            $('.dropdown').addClass('open');
	        });
        },

        onkeypress: function (event){
            if(event.keyCode === 13){ // enter key pressed
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
        },
        
        startSearching: function(){
        	this.$loader.removeClass('hidden');
        },
        
        endSearching: function(){
        	this.$loader.addClass('hidden');
        }

    });

});