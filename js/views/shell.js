define(['jquery','backbone'], function($, Backbone){
	var ShellView = Backbone.View.extend({
	
	    initialize: function () {
	        console.log('Shell init');
	    },
	
	    render: function () {
	        this.$el.html(this.template());
	        $('.navbar-search', this.el).append(this.searchresultsView.render().el);
	        return this;
	    },
	
	    events: {
	        "keyup .search-query": "search",
	        "keypress .search-query": "onkeypress"
	    },
	
	    search: function (event) {
	        var key = $('#searchText').val();
	        this.searchResults.fetch({reset: true, data: {name: key}});
	        var self = this;
	        setTimeout(function () {
	            $('.dropdown').addClass('open');
	        });
	    },
	
	    onkeypress: function (event) {
	        if (event.keyCode === 13) { // enter key pressed
	            event.preventDefault();
	        }
	    },
	
	    selectMenuItem: function(menuItem) {
	        $('.navbar .nav li').removeClass('active');
	        if (menuItem) {
	            $('.' + menuItem).addClass('active');
	        }
	    }
	
	});
	
	return ShellView;
});