var util = require('util');
var Twitter = require('twitter');
var config = require('./config.json');
var mongoose = require('mongoose');
var Tweet = require('../db/tweet');

var apiAccess = {
  	consumer_key: config.twitter.consumer_key,
  	consumer_secret: config.twitter.consumer_secret,
  	access_token_key: config.twitter.access_token_key,
  	access_token_secret: config.twitter.access_token_secret
};

var client = new Twitter(apiAccess);
var currentCharacter;

//Database Connection String
var dbConfig = config.database;
var dbConnection = "mongodb://"+dbConfig.user + ":" + dbConfig.password + "@" + dbConfig.uri + ":" + dbConfig.port + "/" + dbConfig.name;
//Connect to Database
console.log(dbConnection);
mongoose.connect(dbConnection);
var db = mongoose.connection;

db.once('open', function(){
  console.log('Connected to Database!');
});

db.on('error', function (err){
  console.log('Connection Error: ' + err);
});


exports.launchSearch = function(character, startDate, endDate) {
    currentCharacter = character;
    var arguments = getArguments(character, startDate, endDate);
    client.get('search/tweets', arguments, callback);
}


function getArguments(character, startDate, endDate) {
  return {q: character, result_type: 'mixed', since: startDate, until: endDate, lang: 'en'};
}

function callback(error, tweets, response){
    var statuses = tweets['statuses'];
    var tweetArray = [];
    for (var index in statuses) {
      var tweet = statuses[index];
      tweetArray.push(tweet);
    }
    saveTweets(tweetArray);
}

function saveTweets(tweetArray){
    for (var tweet in tweetArray) {
      var currentTweet = tweetArray[tweet];
      var newTweet = Tweet({
        id: currentTweet['id'],
        characterName: currentCharacter,
        created_at: currentTweet['created_at'],
        sentiment: 0
      });
      newTweet.save(function(err){
        if (err) throw err;
        console.log('Tweet saved!');
      })
    }
}
