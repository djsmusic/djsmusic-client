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
    	
    	initialize: function(){
    		this.bind('route', this.trackPageview);
    	},

        routes: {
            "": "home",
            "advertise": "advertise",
            "about": "about",
            "technology": "technology",
            "contact": "contact",
            "browse": "browse",
            "people": "people",
            "music/:songId" : "music",
            "album/:albumId" : "album",
            "dj-songs/:id" : "dj_songs",
            "login" : 'login'
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
                shellView.deselectMenuItems();
            });
        },
        
        advertise: function () {
            require(["app/views/Advertise"], function (View) {
                var view = new View({el: $content});
                view.render();

                shellView.deselectMenuItems();
            });
        },
        
        about: function () {
            require(["app/views/About"], function (View) {
                var view = new View({el: $content});
                view.render();

                shellView.deselectMenuItems();
            });
        },
        
        login: function () {
            require(["app/views/Login"], function (View) {
                var view = new View({el: $content});
                view.render();

                shellView.selectMenuItem('login-menu');
            });
        },
        
        technology: function () {
            require(["app/views/Technology"], function (View) {
                var view = new View({el: $content});
                view.render();

                shellView.deselectMenuItems();
            });
        },
        
        music : function(id){
        	require(["app/views/Music", "app/models/song"], function (View, Song) {
        		console.log('New Song():');
        		var track = new Song({songId: id});
	        	track.fetch({
	    			success: function(data){
	    				var view = new View({el: $content, model: data});
	    				view.render();
	    				shellView.deselectMenuItems();
	    			}
	    		});
            });
        },
        
        album : function(id){
        	require(["app/views/Album", "app/models/album"], function (View, Album) {
        		var album = new Album({albumId: id});
	        	album.fetch({
	    			success: function(data){
	    				var view = new View({el: $content, model: data});
	    				view.render();
	    				shellView.deselectMenuItems();
	    			}
	    		});
            });
        },
        
        dj_songs : function(id){
        	require(["app/views/DJ_Songs", "app/models/user"], function (View, User) {
        		var user = new User({userId: id});
	        	user.fetch({
	    			success: function(data){
	    				var view = new View({el: $content, model: data});
	    				view.render();
	    				shellView.deselectMenuItems();
	    			}
	    		});
            });
        },
        
        // Google Analytics Tracking
        trackPageview: function (){
	        var url = Backbone.history.getFragment();
	
	        // Prepend slash
	        if (!/^\//.test(url) && url != ""){
	            url = "/" + url;
	        }
			
			if(typeof(_gaq)!=='undefined'){
				_gaq.push(['_trackPageview', url]);
			}else{
				console.warn('Router: Google Analytics not found');
			}
	    }

    });

});