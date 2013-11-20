define([
  'jquery'
], function($){
	var HomeView = Backbone.View.extend({
	
	    events:{
	        "click #showMeBtn":"showMeBtnClick",
	        //"click .nav-tabs a":"tabs"
	    },
	
	    render:function () {
	        this.$el.html(this.template());
	        return this;
	    },
	    
	    tabs:function(e){
	    	e.preventDefault();
	    	console.log(this);
	    	$(this).tab('show');
	    	return true;
	    }
	
	});
	
	return HomeView;
});