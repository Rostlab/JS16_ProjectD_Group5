var util = require('util');
var twitter = require('twitter');
var dbTweets = require('../db/dbTweets');
var config = require('../cfg/config.json');
var apiAccess = {
  	consumer_key: config.twitter.consumer_key,
  	consumer_secret: config.twitter.consumer_secret,
  	access_token_key: config.twitter.access_token_key,
  	access_token_secret: config.twitter.access_token_secret
};

var client = new twitter(apiAccess);

exports.getStream = function(characterName, characterID, timeFrame) {
  var startTime = new Date();
	client.stream('statuses/filter', {track: characterName}, function(stream) {
  	stream.on('data', function(tweet) {
      var jsonTweet = getTweetAsJSON(tweet, characterName, characterID);
      dbTweets.saveTweet(jsonTweet);

      var currentTime = new Date();
      if(currentTime.getTime()>=(startTime.getTime()+timeFrame*1000)){
          console.log('Timelimit reached!');
          stream.destroy();
          process.exit();
      }
      });
  	stream.on('error', function(error) {
    	throw error;
  	});
  });
};

exports.getRest = function(characterName, characterID, startDate, endDate) {
    var searchArguments = getRestSearchArguments(characterName, startDate, endDate);
    client.get('search/tweets', searchArguments, function(error, tweets, response){
      var statuses = tweets.statuses;
      var tweetArray = [];
      for (var index in statuses) {
        var tweet = statuses[index];
        tweetArray.push(tweet);
      }
      saveTweets(tweetArray, characterName, characterID);
    });
};

function saveTweets(tweetArray, characterName, characterID){
    for (var tweet in tweetArray) {
      var currentTweet = tweetArray[tweet];
      var jsonTweet = getTweetAsJSON(currentTweet, characterName, characterID);
      dbTweets.saveTweet(jsonTweet);
    }
}

function getTweetAsJSON(tweet, characterName, characterID){
  var jsonTweet = {};
  jsonTweet.id = tweet.id_str;
  jsonTweet.characterName = characterName;
  jsonTweet.created_at = tweet.created_at;
  jsonTweet.characterID = characterID;
  jsonTweet.text = tweet.text;
  jsonTweet.retweeted = tweet.retweet_count;
  jsonTweet.fav = tweet.favorite_count;
  jsonTweet.lang = tweet.lang;
  console.log(jsonTweet);
  return jsonTweet;
}

function getRestSearchArguments(character, startDate, endDate) {
  return {q: character, result_type: 'mixed', since: startDate, until: endDate, lang: 'en'};
}
