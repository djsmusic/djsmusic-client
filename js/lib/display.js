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
    
    Display.number = function(num,separator){
    	if(typeof(separator)==='undefined'){
    		separator = ',';
    	}
    	num = Math.floor(num);
    	var number = num.toFixed(2) + '',
	   		x = number.split('.'),
	    	x1 = x[0],
	    	rgx = /(\d+)(\d{3})/;
	    while (rgx.test(x1)) {
	        x1 = x1.replace(rgx, '$1' + separator + '$2');
	    }
	    return x1;
	};
    
    return Display;
});