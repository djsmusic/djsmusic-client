define(function (require) {

	"use strict";

	var $					= require('jquery'),
		Backbone			= require('backbone'),
		Song				= require('app/models/memory/song'),
	
		songs = [
			{'id': 1, 'thumb': 'img/pic1.gif', 'title': 'This is the song title 1', 'artist': 'dj-backbone 1', 'duration':'2:23', 'downloads': 124, 'rating': 3},
			{'id': 2, 'thumb': 'img/pic2.gif', 'title': 'This is the song title 2', 'artist': 'dj-backbone 2', 'duration':'3:23', 'downloads': 234, 'rating': 4},
			{'id': 3, 'thumb': 'img/pic3.gif', 'title': 'This is the song title 3', 'artist': 'dj-backbone 3', 'duration':'4:23', 'downloads': 356, 'rating': 5}
		],
	  
	  findByRating = function (rating) {
	  		console.log("Finding by rating: ",rating);
            var deferred = $.Deferred(),
                results = songs.filter(function (element) {
                    return rating <= element.rating;
                });
            deferred.resolve(results);
            return deferred.promise();
        },
	   
	   TopSongs = Backbone.Collection.extend({
	   	
	   		initialize: function(models, options){
	   			console.log("Init topsongs: ", options);
	   			this.rating = options.rating;
	   		},

            model: Song,
			
            fetch: function (method, model, options) {
            	console.log('SongCollection rating: ', this.rating);
            	var collection = this;
            	if (method === "read") {
                    findByRating(this.rating).done(function (data) {
                        options.success(data);
                        collection.reset(data);
                    });
                }
            }

       });
   
	return TopSongs;
        
});