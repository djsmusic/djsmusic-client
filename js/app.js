/**
 * Application controller view
 * Starts application
 *
 * @class App
 * @extends Backbone.View
 * @author Alejandro U. Álvarez <alejandro@urbanoalvarez.es>
 */

define(['jquery', 'backbone', 'shell'], function($, Backbone, ShellView) {
	
	var directory = {
	
	    views: {},
	
	    models: {},
	
	    loadTemplates: function(views, callback) {
	
	        var deferreds = [];
	
	        $.each(views, function(index, view) {
	            //if (directory[view]) {
	                deferreds.push($.get('tpl/' + view + '.html', function(data) {
	                	directory[view] = {prototype: {}};
	                    directory[view].prototype.template = _.template(data);
	                }, 'html'));
	            //} else {
	            //    alert(view + " not found");
	            //}
	        });
	
	        $.when.apply(null, deferreds).done(callback);
	    }
	
	};
	
	directory.Router = Backbone.Router.extend({
	
	    routes: {
	        "":                 "home",
	        "contact":          "contact"
	    },
	
	    initialize: function () {
	    	console.log('App init');
	        directory.shellView = new ShellView();
	        $('body').html(directory.shellView.render().el);
	        // Close the search dropdown on click anywhere in the UI
	        $('body').click(function () {
	            $('.dropdown').removeClass("open");
	        });
	        this.$content = $("#content");
	        this.$player = $("#player");
	        
	        directory.PlayerView = new directory.PlayerView();
	        this.$player.html(directory.PlayerView.render().el);
	    },
	
	    home: function () {
	        // Since the home view never changes, we instantiate it and render it only once
	        if (!directory.homelView) {
	            directory.homelView = new directory.HomeView();
	            directory.homelView.render();
	        } else {
	            console.log('reusing home view');
	            directory.homelView.delegateEvents(); // delegate events when the view is recycled
	        }
	        this.$content.html(directory.homelView.el);
	        directory.shellView.selectMenuItem('home-menu');
	    },
	
	    contact: function () {
	        if (!directory.contactView) {
	            directory.contactView = new directory.ContactView();
	            directory.contactView.render();
	        }
	        this.$content.html(directory.contactView.el);
	        directory.shellView.selectMenuItem('contact-menu');
	    }
	});
	
	return directory;
});
