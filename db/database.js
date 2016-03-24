/*
 Module to access database provided by Project A
 */
var config = require('../cfg/config.json');
var request = require('request');
/*
 The callback function must take a date object as a parameter
 */
/*
 Saves a json to the character in the database
 json format:
 {
 "date" : "12.11.2016",    //Analyzed date
 "pos" : "12",    //positive sentiment sum
 "neg" : "43",  // negative sentiment sum
 "posT" : "6",   //number of positive tweets
 "negT" : "4",   // number of negative tweets
 "nullT" : "23"  // number of neutral tweets
 }
 */
exports.saveSentiment = function (charName, json) {
    var url = config.database.sentimentSave;
    request.post(url, json, function (err, resp, body) {
        if(err){
            //TODO
            console.log(err);
        }
    });
};

exports.getSentimentForNameTimeframe = function (charName, startDate, endDate){
    var url = config.database.sentimentGetChar;
    url.replace('startdate', startDate);
    url.replace('enddate', endDate);
    //TODO
};

exports.getSentimentTimeframe = function(startDate, endDate){
    var url = config.database.sentimentGetAll;
    //TODO
};

exports.airDate = function (season, episode, callback) {
    //URL to the API provided by Project A
    var url = config.databaseA.airDateURL;
    //Form includes the search criteria
    var form = {
        form: {
            'season': season,
            'nr': episode
        }
    };
    //Make POST request to API
    request.post(url, form, function (err, resp, body) {
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
 CURRENTLY BROKEN
 */
exports.characterNames = function (callback) {
    //URL to API by ProjectA
    var url = config.databaseA.characterNamesURL;
    //GET request to API
    request.get(url, function (err, resp, body) {
        //check foŕ valid response
        console.log(body);
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