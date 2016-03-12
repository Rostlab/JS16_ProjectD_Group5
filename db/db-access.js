var request = require('request');
//URL to the API provided by Project A
var url = 'https://got-api.bruck.me/api/episodes/find';

/*
The callback function must take a date object as a parameter
*/
module.exports.airDate = function(season, episode, callback){
	//Form includes the search criteria 
	var form =  {
		form: {
			'season': season,
			'nr' : episode
		}	
	};
	//Make POST request to API
	var answer = request.post(url,form, function(err, resp, body){
		//just get the airing date information
		var json = JSON.parse(body);
		var airDate = json.data[0].airDate; //dateString is in format: "2011-04-16T22:00:00.000Z"
		if(!err && resp.statusCode === 200){
			//make a Date object for the callback function to use
			callback(new Date(airDate));
		}
	});
};
