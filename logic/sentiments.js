var dbA = require('../db/dbA');
var dbTweets = require('../db/dbTweets');
var sentiment = require('sentiment');

var date;
var name;
var posSentiment;
var negSentiment;
var posTweets;
var negTweets;
var nullTweets;

exports.getSentimentsForTweets = function (characterName, startDate, endDate) {

    date = startDate;
    name = characterName;

    var jsonParams = {};
    jsonParams.characterName = characterName;
    jsonParams.startDate = startDate;
    jsonParams.endDate = endDate;

    return dbTweets.getTweets(jsonParams, analyzeTweets);
};

function analyzeTweets (tweets) {
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

}

function saveSentiments() {

    var sentimentJSON = {};
    sentimentJSON.date = date;
    sentimentJSON.posSentiment = posSentiment;
    sentimentJSON.negSentiment = negSentiment;
    sentimentJSON.posTweets = posTweets;
    sentimentJSON.negTweets = negTweets;
    sentimentJSON.nullTweets = nullTweets;

    dbA.saveSentiment(name, sentimentJSON);
}