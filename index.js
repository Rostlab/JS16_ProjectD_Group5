//Added some dummy logic to test the tests :P
//The whole thing has to be done!
//Functions can be changed
//Content needs to be changed.

var automation = require('./logic/automate.js');
var twitterAPI = require('./logic/twitterAPI.js');
//start automation as default
automation.startAutomation();


module.exports = {

    /*
     Gets the score (positive and negative) for a character on a given day
     Input:
     {
     "characterName" : "Jon Snow",
     "date" : "2016-03-18T"
     }
     */
    getSentimentForName: function (json, callback) {
        //DUMMY RESPOSE, TO BE REPLACED
        var resp = {
            "characterName": json.characterName,
            "date": json.date, //date of the tweets
            "posSum": 23, //sum of the positive sentiment score on that given day
            "negSum": 21,   //sum of the negative sentiment score on that given day
            "posCount": 11, //count of positive tweets that day
            "negCount": 5, //sum of negative tweets that day
            "nullCount": 8 //sum of neutral tweets that day
        }; //not an array, single element response
        callback(resp);
    },
    /*
     returns Analysis over a timeframe (same as above)
     Input json:
     {
     "name" : "Some Name",
     "startDate" : ISODate",
     "endDate" : 'ISODate"
     }
     */
    getSentimentForNameTimeframe: function (json, callback) {
        //DUMMY RESPOSE, TO BE REPLACED
        var resp = [{
            "characterName": "Jon Snow",
            "date": "2016-03-18T14:40:42.782Z",
            "posSum": 23,
            "negSum": 21,
            "posCount": 11,
            "negCount": 5,
            "nullCount": 8
        }]; //note that this in array and will usually contain more than one element
        callback(resp);

    },
    /*
     returns Array of names, which are most loved. with length=number. Ordered!
     Input:
     {
     "number" : 3,  //this is the count of how many you want e.g. 3 for top3
     "startDate' : "ISODate",
     "endDate' : "ISODate"
     */
    topSentiment: function (json, callback) {
        var resp = [{
            "name": "Jon Snow",
            "posSum": 60,
            "negSum": 21,
            "posCount": 11,
            "negCount": 5,
            "nullCount": 8
        },
            {
                "name": "Hodor",
                "posSum": 59,
                "negSum": 21,
                "posCount": 11,
                "negCount": 5,
                "nullCount": 8
            }
        ];
        callback(resp);
    },
    /*
     Same as above but most hated
     */
    worstSentiment: function (json, callback) {
        var resp = [{
            "name": "Jon Snow",
            "posSum": 23,
            "negSum": 66,
            "posCount": 11,
            "negCount": 5,
            "nullCount": 8
        }
        ];
        callback(resp);
    },
    /*
     Same as above but with most tweeted about
     */
    mostTalkedAbout: function (json, callback) {
        var resp = [{
            "name": "Jon Snow",
            "posSum": 23,
            "negSum": 21,
            "posCount": 110,
            "negCount": 5,
            "nullCount": 8
        },
            {
                "name": "Hodor",
                "posSum": 23,
                "negSum": 21,
                "posCount": 11,
                "negCount": 5,
                "nullCount": 8
            }];
        callback(resp);
    },
    /*
     returns Characters, which have the highest difference between positive and negative sentiments. Ordered.
     Still same as above
     */
    topControversial: function (json, callback) {
        var resp = [{
            "name": "Jon Snow",
            "posSum": 30,
            "negSum": 30,
            "posCount": 11,
            "negCount": 5,
            "nullCount": 8
        },
            {
                "name": "Hodor",
                "posSum": 23,
                "negSum": 21,
                "posCount": 11,
                "negCount": 5,
                "nullCount": 8
            }];
        callback(resp);
    },
    /*
     returns sentiments for name from airing date and the week after on (season,episode).
     Input:
     {
     "name" : "Jon Snow",
     "season" : 1,
     "episode" : 1
     }
     */
    sentimentPerEpisode: function (json, callback) {
        var resp = {
            "name": json.name,
            "posSum": 23,
            "negSum": 21,
            "posCount": 11,
            "negCount": 5,
            "nullCount": 8
        };
        callback(resp);
    },
    /*
     run the twitter REST API for a character to fill the database with tweets. startDate can be 2 weeks
     in the past at most
     */
    runTwitterREST: function (characterName, startDate, callback) {
        twitterAPI.getRest(characterName, startDate, new Date (), false, callback);
    },
    /*
     runs the twitter streaming API to fill the database for a character and a duration in seconds
     */
    runTwitterStreaming: function (characterName, duration, callback) {
        twitterAPI.getStream(characterName, duration, false, callback);
    },
    /*
     Starts the automation for an optional amount of minutes, default is 12 minutes timeframe
     */
    startAutomation: function () {
        automation.startAutomation();
    },
    /*
     Stops the automation. Can be restarted again with startAutomation()
     */
    stopAutomation: function () {
        automation.stopAutomation();
    }
};