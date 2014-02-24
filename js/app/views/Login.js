define(function (require) {

    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/Login.html'),
        App			= require('app/app'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	events: {
    		'submit #loginForm' : 'login',
    		'submit #registerForm': 'register'
    	},
    	
    	login: function(e){
    		e.preventDefault();
    		App.session.login({
    			email: $('#loginEmail').val(),
    			pass: $('#loginPass').val()
    		}, {
    			error: function(){
	    			App.showAlert('Error','Wrong username or password, please try again');
	    		},
	    		success: function(mod,res){
	    			//App.showAlert('','Login done, id = '+res);
	    			App.router.navigate('profile', {trigger: true});
	    		}
    		});
    	},

        render: function () {
            this.$el.html(template());
            return this;
        }

    });

});