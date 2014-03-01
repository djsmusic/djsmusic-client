define(function (require, exports, module) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),
        App					= require('app/app'),

    UserModel = Backbone.Model.extend({

        initialize: function(){
            _.bindAll(this);        
        },

        defaults: {
            id: 0,
            username: '',
            name: '',
            email: ''
        },

        url: function(){
        	return App.url+"users/"+this.get('id');
        }

    });
    
    return UserModel;
});