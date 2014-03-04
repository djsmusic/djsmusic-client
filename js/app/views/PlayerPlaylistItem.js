define(function (require) {

    "use strict";

    var $           = require('jquery'),
        _           = require('underscore'),
        Backbone    = require('backbone'),
        tpl         = require('text!tpl/PlayerPlaylistItem.html'),

        template = _.template(tpl);

    return Backbone.View.extend({
    	
    	tagName: 'li',
    	
    	initialize: function(){
    		this.model.on("change", this.render, this);
    	},
    	
    	events: {
    		
    	},
    	
    	render: function () {
            this.$el.html(template(this.model.attributes));
            // Add the tooltip
            this.$el.find('a.track').tooltip({
				delay: { show: 250, hide: 0 }
			});
            return this;
        }

    });

});