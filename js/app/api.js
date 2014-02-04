define(function (require, exports, module) {

    "use strict";

    var API = {
    	productionUrl: 'http://api.djs-music.com/',
    	localUrl: 'http://localhost/djsmusic/',
    	url: ''
    };
    
    API.url = API.productionUrl;
    
    if(module.config().mode == 1){
    	console.info('API: Local mode');
    	API.url = API.localUrl;
    }
    
    return API;
});