//includes
var util = require('util'),
    twitter = require('twitter'),
    //make a local JSON file with access codes. see configDUMMY.json for example
    config = require('config.json');
    sentimentAnalysis = require('./sentimentAnalysis.js')

//config
var apiAccess = {
  	consumer_key: config.consumer_key,
  	consumer_secret: config.consumer_secret,
  	access_token_key: config.access_token_key,
  	access_token_secret: config.access_token_secret
};

var client = new twitter(apiAccess);
/*
Currently only logs results to console. Needs to be stored in a database
to later process. 
Include timeframe/number of tweets to end stream?
*/
exports.getStream = function(searchTerm) {
	var count = 0;
	client.stream('statuses/filter', {track: searchTerm}, function(stream) {
  	stream.on('data', function(tweet) {
      var resp = {}; //response JSON
      resp.searchTerm = searchTerm;
      resp.sentiment = sentimentAnalysis(tweet.text).score; //gets sentiment score based on AFINN and training
  		resp.date = tweet.created_at; //timestamp. format: "Wed Aug 27 13:08:45 +0000 2008"
      resp.id = tweet.id_str; //unique ID of the tweet
      console.log(resp);
      count++;
      if(count ===3){stream.destroy();}
      
      //push response to db

      
  	});
  	stream.on('error', function(error) {
    	throw error;
  	});
	});
}

//TODO streaming by hashtag

/* EXAMPLE FROM 
module.exports = function(text, callback) {
  var twitterClient = new twitter(config);
  var response = [], dbData = []; // to store the tweets and sentiment

  twitterClient.search(text, function(data) {
    for (var i = 0; i < data.statuses.length; i++) {
      var resp = {};

      resp.tweet = data.statuses[i];
      resp.sentiment = sentimentAnalysis(data.statuses[i].text);
      dbData.push({
        tweet: resp.tweet.text,
        score: resp.sentiment.score
      });
      response.push(resp);
    };
    db.sentiments.save(dbData);
    callback(response);
  });
}
*/