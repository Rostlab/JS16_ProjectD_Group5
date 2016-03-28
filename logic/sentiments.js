var db = require('../db/database');
var sentiment = require('sentiment');

var posSentiment;
var negSentiment;
var posTweets;
var negTweets;
var nullTweets;

exports.calculateSentimentsForTweets = function (characterName, tweets, startDate, endDate, isSaved, callback) {

    initializeCounters();
    
    for (var index in tweets) {
        var currentTweet = tweets[index];
        var sentimentScore = sentiment(currentTweet.text).score;

        if (sentimentScore > 0) {
            posSentiment += sentimentScore;
            posTweets += 1;
        } else if (sentimentScore < 0) {
            negSentiment += sentimentScore;
            negTweets += 1;
        } else {
            nullTweets += 1;
        }
    }

    saveSentiments(characterName, endDate, isSaved, callback);

};


function saveSentiments(characterName, endDate, isSaved, callback) {

    var sentimentJSON = {};
    sentimentJSON.date = endDate;
    sentimentJSON.posSum = posSentiment;
    sentimentJSON.negSum = negSentiment;
    sentimentJSON.posCount = posTweets;
    sentimentJSON.negCount = negTweets;
    sentimentJSON.nullCount = nullTweets;
    sentimentJSON.description = "Group 5";

    if (isSaved) {
        db.saveSentiment(characterName, sentimentJSON);
    } else {
        callback(sentimentJSON);
    }
}

function initializeCounters() {
    posSentiment = 0;
    negSentiment = 0;
    posTweets = 0;
    negTweets = 0;
    nullTweets = 0;
}