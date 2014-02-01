define(function (require) {

    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/Music.html'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	initialize: function(data){
    		console.log('Music: init');
    		this.model.on("change", this.render);
    	},

        render: function () {
        	this.$el.html(template(this.model.attributes));
            return this;
        }

    });

});