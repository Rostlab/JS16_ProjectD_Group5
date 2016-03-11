var request = require('request');
var url = 'https://got-api.bruck.me/api/episodes/find';
var form =  {
	form: {
		season: '1'
	}
};
var answer = request.post(url,form, function(err, resp, body){
	console.log(body);
});