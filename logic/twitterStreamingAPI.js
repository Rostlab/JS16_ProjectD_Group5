//includes
var util = require('util');
var twitter = require('twitter');
    //make a local JSON file with access codes. see configDUMMY.json for example
var config = require('./config.json');
var sentimentAnalysis = require('./sentimentAnalysis.js');
var mongoose = require('mongoose');
var Tweet = require('./db/tweet');
//config
var apiAccess = {
  	consumer_key: config.twitter.consumer_key,
  	consumer_secret: config.twitter.consumer_secret,
  	access_token_key: config.twitter.access_token_key,
  	access_token_secret: config.twitter.access_token_secret
};

var client = new twitter(apiAccess);

//Database Connection String
var dbConfig = config.database;
var dbConnection = "mongodb://"+dbConfig.user + ":" + dbConfig.password + "@" + dbConfig.uri + ":" + dbConfig.port + "/" + dbConfig.name;
//Connect to Database
console.log(dbConnection);
mongoose.connect(dbConnection);
var db = mongoose.connection;

db.once('open', function(){
  console.log('Connected to Database!');
})

db.on('error', function (err){
  console.log('Connection Error: ' + err);
})
/*
Currently only logs results to console. Needs to be stored in a database
to later process. 
Include timeframe/number of tweets to end stream?
*/
exports.getStream = function(searchTerm) {
	client.stream('statuses/filter', {track: searchTerm}, function(stream) {
  	stream.on('data', function(tweet) {
      var resp = {}; //response JSON
      resp.searchTerm = searchTerm;
      resp.sentiment = sentimentAnalysis(tweet.text).score; //gets sentiment score based on AFINN and training
  		resp.date = tweet.created_at; //timestamp. format: "Wed Aug 27 13:08:45 +0000 2008"
      resp.id = tweet.id_str; //unique ID of the tweet
      console.log(resp);      
      //push response to db
      var newTweet = Tweet({
        id : resp.id,
        characterName : resp.searchTerm,
        created_at : new Date(resp.Date),
        sentiment : resp.sentiment
      });
      newTweet.save(function(err){
        if (err) throw err;
        console.log('Tweet saved!');
      });
  	});
  	stream.on('error', function(error) {
    	throw error;
  	});
	});
}
