var util = require('util');
var twitter = require('twitter');
var sentiments = require('./sentiments');

//local config must be in /cfg/config.json. See configDUMMY.json for example
var config = require('../cfg/config.json');
var apiAccess = {
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
};

var client = new twitter(apiAccess);

var SearchError = function (message, date, searchedName) {
    this.name = 'SearchError';
    this.message = message || 'Some Failure happened while searching for a SentimentAnalysis';
    this.stack = (new Error()).stack;
    this.date = date;
    this.character = searchedName;
};

SearchError.prototype = Object.create(Error.prototype);
SearchError.prototype.constructor = SearchError;
//launch Streaming-API search
//timeFrame in seconds
exports.getStream = function (characterName, duration, isSaved, callback) {
    var tweetArray = [];
    var currentDate = getCurrentDateAsString();
    var trimmedCharacterName = removeParentheses(characterName);

    client.stream('statuses/filter', {track: trimmedCharacterName}, function (stream) {
        stream.on('data', function (tweet) {
            tweetArray.push(tweet);
        });
        stream.on('error', function (error) {
            throw error;
        });
        setTimeout(function () {
            stream.destroy();
            if (tweetArray.length === 0) {
                var error = new SearchError('No tweets recorded', new Date().toISOString(), characterName);
                callback(undefined, error);
            } else {
                runSentimentAnalysis(tweetArray, characterName, currentDate, currentDate, isSaved, callback);
            }
        }, duration * 1000);
    });

};

//launch Rest-API search
//startDate, endDate in format "yyyy-mm-dd"
exports.getRest = function (characterName, startDate, endDate, isSaved, callback) {
    var trimmedCharacterName = removeParentheses(characterName);
    var searchArguments = getRestSearchArguments(trimmedCharacterName, startDate, endDate);
    client.get('search/tweets', searchArguments, function (error, tweets, response) {
        var statuses = tweets.statuses;
        var tweetArray = [];
        for (var index in statuses) {
            var tweet = statuses[index];
            tweetArray.push(tweet);
        }
        runSentimentAnalysis(tweetArray, characterName, startDate, endDate, isSaved, callback);
    });
};

function runSentimentAnalysis(tweetArray, characterName, startDate, endDate, isSaved, callback) {
    var jsonTweets = getJSONTweetArray(tweetArray, characterName);
    sentiments.calculateSentimentsForTweets(characterName, jsonTweets, startDate, endDate, isSaved, callback);
}

function getJSONTweetArray(tweetArray, characterName) {
    var JSONArray = [];
    for (var tweet in tweetArray) {
        JSONArray.push(getTweetAsJSON(tweetArray[tweet], characterName));
    }
    return JSONArray;
}

function getTweetAsJSON(tweet, characterName) {
    var jsonTweet = {};
    jsonTweet.created_at = tweet.created_at;
    jsonTweet.text = tweet.text;
    jsonTweet.retweeted = tweet.retweet_count;
    jsonTweet.fav = tweet.favorite_count;
    return jsonTweet;
}

function getRestSearchArguments(character, startDate, endDate) {
    return {q: character, result_type: 'mixed', since: startDate, until: endDate, lang: 'en', count: 100};
}

function getCurrentDateAsString() {
    var currentDate = new Date();
    var currentMonth = currentDate.getMonth() + 1;
    if (currentMonth < 10) {
        currentMonth = "0" + currentMonth;
    }
    var dateString = currentDate.getFullYear() + "-" + currentMonth + "-" + currentDate.getDate();
    return dateString;
}

function removeParentheses(string) {
    var index = string.indexOf("(");
    if (index > 0) {
        string = string.slice(0, string.indexOf("(")).trim();
    }
    return string;
}