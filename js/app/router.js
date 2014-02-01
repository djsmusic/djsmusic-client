define(function (require) {

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone'),
        ShellView   = require('app/views/Shell'),

        $body = $('body'),
        shellView = new ShellView({el: $body}).render(),
        $content = $("#content", shellView.el);

    // Close the search dropdown on click anywhere in the UI
    $body.click(function () {
        $('.dropdown').removeClass("open");
    });

    $("body").on("click", "#showMeBtn", function (event) {
        event.preventDefault();
        shellView.search();
    });

    return Backbone.Router.extend({

        routes: {
            "": "home",
            "contact": "contact",
            "browse": "browse",
            "people": "people",
            "music/:songId" : "music"
        },

        home: function () {
        	require(["app/views/Home"], function (HomeView) {
        		var view = new HomeView({el: $content});
	            view.render();
	            //view.delegateEvents(); // delegate events when the view is recycled
	            shellView.selectMenuItem('home-menu');
	    	});
        },
        
        browse: function () {
            require(["app/views/Browse"], function (View) {
                var view = new View({el: $content});
                view.render();
                shellView.selectMenuItem('browse-menu');
            });
        },
        
        people: function () {
            require(["app/views/People"], function (View) {
                var view = new View({el: $content});
                view.render();
                shellView.selectMenuItem('people-menu');
            });
        },

        contact: function () {
            require(["app/views/Contact"], function (View) {
                var view = new View({el: $content});
                view.render();
                shellView.selectMenuItem('contact-menu');
            });
        },
        
        music : function(id){
        	require(["app/views/Music", "app/models/song"], function (View, Song) {
        		var track = new Song();
	        	track.fetch({
	    			data:{
	    				songId: id
	    			},
	    			success: function(data){
	    				var view = new View({el: $content, model: data});
	    				view.render();
	    			}
	    		});
            });
        }

    });

});