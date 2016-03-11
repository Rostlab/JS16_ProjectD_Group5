var request = require('request');
//URL to the API provided by Project A
var url = 'https://got-api.bruck.me/api/episodes/find';


//dateString is in format: "2011-04-16T22:00:00.000Z"
var makeDateObject = function(dateString){
	var year = dateString.slice(0,4);
	var month = parseInt(dateString.slice(5,7))-1;
	var day = parseInt(dateString.slice(8,10))+1;
	var hours = dateString.slice(11,13);
	var minutes = dateString.slice(14,16);
	var date = new Date(year,month,day,hours,minutes);
	return date;

};
var airDate = function(season, episode, callback){
	var form =  {
	form: {
		'season': season,
		'nr' : episode
		}	
	};
	var answer = request.post(url,form, function(err, resp, body){
		var json = JSON.parse(body);
		var airDate = json.data[0].airDate;
		if(!err && resp.statusCode === 200){
			callback(airDate);
		}
	});
};
module.exports.getAirDate = function(season, episode){
	airDate(season, episode, makeDateObject);
	console.log(airDate);
};
