var request = require('request');
var mongoose = require('mongoose');
var Tweet = require('./tweet');
var config = require('../cfg/config.json');
/*
 Configuration of Database access
 */
var dbConfig = config.database;
var dbConnection = "mongodb://" + dbConfig.user + ":" + dbConfig.password + "@" + dbConfig.uri + ":" + dbConfig.port + "/" + dbConfig.name;
console.log(dbConnection);

//Database A security token
var tokenString = "?token=" + config.databaseA.token;

/*
 The callback function must take a date object as a parameter
 */
exports.airDate = function (season, episode, callback) {
    //URL to the API provided by Project A
    var url = 'https://got-api.bruck.me/api/episodes/find/' + tokenString;
    //Form includes the search criteria
    var form = {
        form: {
            'season': season,
            'nr': episode
        }
    };
    //Make POST request to API
    request.post(url, form, function (err, resp, body) {
        console.log(body);
        if (!err && resp.statusCode === 200) {
            //just get the airing date information
            var json = JSON.parse(body);
            var airDate = json.data[0].airDate; //dateString is in format: "2011-04-16T22:00:00.000Z"
            //make a Date object for the callback function to use
            callback(new Date(airDate));
        }
    });
};

/*
 Callback function gets JSON with all character Names as parameter
 */
exports.characterNames = function (callback) {

    //URL to API by ProjectA
    var url = 'https://got-api.bruck.me/api/characters/' + tokenString;
    //GET request to API
    request.get(url, function (err, resp, body) {
        //check foŕ valid response
        if (!err && resp.statusCode === 200) {
            //parse answer String to a JSON Object
            var json = JSON.parse(body);
            var formatted = []; //make it an array for easier iteration
            for (var i = 0; i < json.length; i++) {
                //only include the names
                formatted.push({
                    name: json[i].name
                });
            }
            //give JSON object to the callback function
            callback(formatted);
        }
    });
};
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