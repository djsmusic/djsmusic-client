define(function (require) {

    "use strict";

    var $                   = require('jquery'),
        Backbone            = require('backbone'),

        Song = Backbone.Model.extend({
			urlRoot: "http://api.djs-music.com/song"
        });

    return Song;


});