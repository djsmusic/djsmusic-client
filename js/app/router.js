define(function (require) {

    "use strict";

    var $           = require('jquery'),
        Backbone    = require('backbone'),
        ShellView   = require('app/views/Shell'),
        App			= require('app/app'),
        Session		= require('app/models/Session');

    return Backbone.Router.extend({
    	
    	initialize: function(){
    		this.bind('route', this.trackPageview);
    		
    		// Create a new session model and scope it to the app global
		    // This will be a singleton, which other modules can access
		    App.session = new Session({});
		    
		    console.log('App session defined');
		
		    // Check the auth status upon initialization,
		    // before rendering anything or matching routes
		    App.session.checkAuth({
		
		        // Start the backbone routing once we have captured a user's auth status
		        complete: function(){
					// HTML5 pushState for URLs without hashbangs
		            /*var hasPushstate = !!(window.history && history.pushState);
		            if(hasPushstate) Backbone.history.start({ pushState: true, root: '/' } );
		            else Backbone.history.start();*/
					Backbone.history.start();
		        }
		    });
		    
			this.$body = $('body');
			this.shellView = new ShellView({el: this.$body}).render();
			this.$content = $("#content", this.shellView.el);
			
			// Close the search dropdown on click anywhere in the UI
			this.$body.click(function () {
		        $('.dropdown').removeClass("open");
		    });
		
		    $("body").on("click", "#showMeBtn", function (event) {
		        event.preventDefault();
		        this.shellView.search();
		    });
        
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
            "login" : 'login',
            "register": 'login',
            "profile" : 'profile'
        },

        home: function () {
        	var this_ = this;
        	require(["app/views/Home"], function (HomeView) {
        		var view = new HomeView({el: this_.$content});
	            view.render();
	            //view.delegateEvents(); // delegate events when the view is recycled
	            this_.shellView.selectMenuItem('home-menu');
	    	});
        },
        
        browse: function () {
        	var this_ = this;
            require(["app/views/Browse"], function (View) {
                var view = new View({el: this_.$content});
                view.render();
                this_.shellView.selectMenuItem('browse-menu');
            });
        },
        
        people: function () {
        	var this_ = this;
            require(["app/views/People"], function (View) {
                var view = new View({el: this_.$content});
                view.render();
                this_.shellView.selectMenuItem('people-menu');
            });
        },

        contact: function () {
        	var this_ = this;
            require(["app/views/Contact"], function (View) {
                var view = new View({el: this_.$content});
                view.render();
                this_.shellView.deselectMenuItems();
            });
        },
        
        advertise: function () {
        	var this_ = this;
            require(["app/views/Advertise"], function (View) {
                var view = new View({el: this_.$content});
                view.render();

                this_.shellView.deselectMenuItems();
            });
        },
        
        about: function () {
        	var this_ = this;
            require(["app/views/About"], function (View) {
                var view = new View({el: this_.$content});
                view.render();

                this_.shellView.deselectMenuItems();
            });
        },
        
        login: function () {
        	var this_ = this;
        	if(App.session.get('logged-in')){
        		console.warn('Already logged in, redirect to profile');
        		App.router.navigate('profile', {trigger: true});
        		return;
        	}
            require(["app/views/Login"], function (View) {
                var view = new View({el: this_.$content});
                view.render();

                this_.shellView.selectMenuItem('login-menu');
            });
        },
        
        profile: function () {
        	var this_ = this;
        	if(!App.session.get('logged-in')){
        		console.warn('Not logged in, redirect to login');
        		App.router.navigate('login', {trigger: true});
        		return;
        	}
            require(["app/views/Profile"], function (View) {
                var view = new View({el: this_.$content});
                view.render();

                this_.shellView.selectMenuItem('login-menu');
            });
        },
        
        technology: function () {
        	var this_ = this;
            require(["app/views/Technology"], function (View) {
                var view = new View({el: this_.$content});
                view.render();

                this_.shellView.deselectMenuItems();
            });
        },
        
        music : function(id){
        	var this_ = this;
        	require(["app/views/Music", "app/models/song"], function (View, Song) {
        		console.log('New Song():');
        		var track = new Song({songId: id});
	        	track.fetch({
	    			success: function(data){
	    				var view = new View({el: this_.$content, model: data});
	    				view.render();
	    				this_.shellView.deselectMenuItems();
	    			}
	    		});
            });
        },
        
        album : function(id){
        	var this_ = this;
        	require(["app/views/Album", "app/models/album"], function (View, Album) {
        		var album = new Album({albumId: id});
	        	album.fetch({
	    			success: function(data){
	    				var view = new View({el: this_.$content, model: data});
	    				view.render();
	    				this_.shellView.deselectMenuItems();
	    			}
	    		});
            });
        },
        
        dj_songs : function(id){
        	var this_ = this;
        	require(["app/views/DJ_Songs", "app/models/user"], function (View, User) {
        		var user = new User({userId: id});
	        	user.fetch({
	    			success: function(data){
	    				var view = new View({el: this_.$content, model: data});
	    				view.render();
	    				this_.shellView.deselectMenuItems();
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