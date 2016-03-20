var request = require('request');
var mongoose = require('mongoose');
var Tweet = require('./tweet');
var config = require('../cfg/config.json');
/*
 Configuration of Database access
 */
var dbConfig = config.database;
var dbConnection = "mongodb://" + dbConfig.user + ":" + dbConfig.password + "@" + dbConfig.uri + ":" + dbConfig.port + "/" + dbConfig.name;
var db = mongoose.connection;
db.once('open', function () {
    console.log('Connected to Database!');
});

db.on('error', function (err) {
    console.log('Connection Error: ' + err);
});
mongoose.connect(dbConnection);
var onErr = function (err, callback) {
    db.close();
    callback(err);
};
/*
 Saves the information gathered from a tweet in our database

 searchTerm: The search phrase used e.g. character name like 'Jon Snow'
 id: unique id of the tweet. Test tweets get id 0
 created_at: the date the tweet was created at in Javascript date String format
 score: Score calculated by the sentiment analysis
 */
exports.saveTweet = function (json) {
    //make tweet
    var newTweet = Tweet({
        id: json.id,
        characterName: json.characterName,
        created_at: json.created_at,
        characterID: json.characterID,
        text: json.text,
        retweeted: json.retweeted,
        fav: json.fav,
        lang: json.lang
    });

    //save
    newTweet.save(function (err) {
        if (err) {
            console.log('Error saving tweet');
            throw err;
        } else {
            console.log('Tweet saved!');
        }
    });
};
/*
 Creates a json array with all tweets that match the search query
 The json parameter has the search Query items. Example:
 {
 "characterID" : "12345",
 "startDate" : "someDate",  ISOString
 "endDate": "someDate", ISOString
 */
exports.getTweets = function (json, callback) {
    db.collection('tweets').find({
        characterID: json.characterID,
        created_at: {
            $gte: new Date(json.startDate),
            $lt: new Date(json.endDate)
        }
    }, function (err, cursor) {
        var json = [];
        cursor.each(function (err, doc) {
            if (doc !== null) {
                json.push(doc);
            } else {
                callback(json);
            }
        });
    });
};
