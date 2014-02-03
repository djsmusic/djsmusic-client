define([], function () {
    'use strict';
    var Display = {};
    
    Display.timeToString = function(time){
    	var sec_num = time;
	    var minutes = Math.floor(sec_num / 60);
	    var seconds = Math.floor(sec_num - (minutes * 60));
	
	    if (minutes < 10) {minutes = "0"+minutes;}
	    if (seconds < 10) {seconds = "0"+seconds;}
	    var time    = minutes+':'+seconds;
	    return time;
    };
    
    Display.rating = function(rating){
    	var ret = '';
    	for(var i=0;i<rating;i++){
    		ret += '<i class="glyphicon glyphicon-star"></i>';
    	}
    	for(var i=0;i<5-rating;i++){
    		ret += '<i class="glyphicon glyphicon-star-empty"></i>';
    	}
    	return ret;
    };
    
    return Display;
});