var request = require('request');
var mongoose = require('mongoose');
var Tweet = require('./tweet');
var config = require('../cfg/config.json');
/*
 Configuration of Database access
 */
var dbConfig = config.database;
var dbConnection = "mongodb://" + dbConfig.user + ":" + dbConfig.password + "@" + dbConfig.uri + ":" + dbConfig.port + "/" + dbConfig.name;


/*
 Saves the information gathered from a tweet in our database

 searchTerm: The search phrase used e.g. character name like 'Jon Snow'
 id: unique id of the tweet. Test tweets get id 0
 created_at: the date the tweet was created at in Javascript date String format
 score: Score calculated by the sentiment analysis
 */
exports.saveTweet = function (searchTerm, id, date, score) {
    //connect to db
    mongoose.connect(dbConnection);
    var db = mongoose.connection;
    db.once('open', function () {
        console.log('Connected to Database!');
    });

    db.on('error', function (err) {
        console.log('Connection Error: ' + err);
    });
    //make tweet
    var newTweet = Tweet({
        id: id,
        characterName: searchTerm,
        created_at: new Date(date),
        sentiment: score
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