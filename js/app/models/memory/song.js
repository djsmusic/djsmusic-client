define(function (require) {

	"use strict";

	var $					= require('jquery'),
		Backbone			= require('backbone'),
	
		songs = [
			{'id': 1, 'thumb': 'img/pic1.gif', 'title': 'This is the song title 1', 'artist': 'dj-backbone 1', 'duration':'2:23', 'downloads': 124, 'rating': 3},
			{'id': 2, 'thumb': 'img/pic2.gif', 'title': 'This is the song title 2', 'artist': 'dj-backbone 2', 'duration':'3:23', 'downloads': 234, 'rating': 4},
			{'id': 3, 'thumb': 'img/pic3.gif', 'title': 'This is the song title 3', 'artist': 'dj-backbone 3', 'duration':'4:23', 'downloads': 356, 'rating': 5}
		],
		
		findById = function (id) {
	        var deferred = $.Deferred(),
	            song = null,
	            l = songs.length,
	            i;
	        for (i = 0; i < l; i = i + 1) {
	            if (songs[i].id === id) {
	                song = songs[i];
	                break;
	            }
	        }
	        deferred.resolve(song);
	        return deferred.promise();
	  },
	  
	  findByRating = function (rating) {
	  		console.log("Finding by rating: ",rating);
            var deferred = $.Deferred(),
                results = songs.filter(function (element) {
                    return rating <= element.rating;
                });
            deferred.resolve(results);
            return deferred.promise();
        },
   
	   Song = Backbone.Model.extend({
	
	        initialize: function () {
	            //this.reports = new ReportsCollection();
	            //this.reports.parent = this;
	            this.topSongs = new SongCollection();
	            this.topSongs.parent = this;
	        },
	
	        sync: function (method, model, options) {
	            if (method === "read") {
	                findById(parseInt(this.id)).done(function (data) {
	                	console.log("Found by id: ", data);
	                    options.success(data);
	                });
	            }
	        }
	
	   }),
	   
	   SongCollection = Backbone.Collection.extend({

            model: Song,

            sync: function (method, model, options) {
            	if (method === "read") {
                    findByRating(options.rating).done(function (data) {
                        options.success(data);
                    });
                }
            }

       });
   
	return {
		Song: Song,
		Songs : SongCollection
	};
        
});