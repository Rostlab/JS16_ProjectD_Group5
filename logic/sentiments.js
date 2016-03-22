var dbA = require('../db/dbA');
var sentiment = require('sentiment');

var posSentiment;
var negSentiment;
var posTweets;
var negTweets;
var nullTweets;

exports.calculateSentimentsForTweets = function (characterName, tweets, startDate, endDate, isSaved, callback) {

    for (var index in tweets) {
        var currentTweet = tweets[index];
        var sentimentScore = sentiment(currentTweet.text);

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
    sentimentJSON.posSentiment = posSentiment;
    sentimentJSON.negSentiment = negSentiment;
    sentimentJSON.posTweets = posTweets;
    sentimentJSON.negTweets = negTweets;
    sentimentJSON.nullTweets = nullTweets;

    if (isSaved) {
        dbA.saveSentiment(characterName, sentimentJSON);
    } else {
        callback(sentimentJSON);
    }
}