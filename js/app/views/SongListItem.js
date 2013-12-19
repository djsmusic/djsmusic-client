define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        _                   = require('underscore'),
        Backbone            = require('backbone'),
        tpl                 = require('text!tpl/SongListItem.html'),

        template = _.template(tpl);

    return Backbone.View.extend({

        tagName: "tr",

        initialize: function () {
            this.model.on("change", this.render, this);
        },

        render: function () {
        	console.log('Using:',this.model.attributes);
            this.$el.html(template(this.model.attributes));
            return this;
        }

    });

});