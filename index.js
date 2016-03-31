var automation = require('./logic/automate.js');
var twitterAPI = require('./logic/twitterAPI.js');
var database = require('./db/database.js');

//start automation as default
automation.startAutomation();

//get n biggest element from the list
//i: position of the value in object
var getMostNFromArray1 = function (array, n, property) {
    var nMost = new Array(n);
    //sorting the list in decreasing oder
    array.sort(function (a, b) {
        return b[property] - a[property];
    });
    for (var j = 0; j < n; j++) {
        nMost[j] = array[j];
    }
    return nMost;
};
var getMostNFromArray2 = function (array, n, arrayOfProp) {
    var nMost = new Array(n);
    //sorting the list in decreasing oder
    array.sort(function (a, b) {
        var aSum = 0, bSum = 0;
        for (var k = 0; k < arrayOfProp.length; k++) {
            aSum += a[arrayOfProp[k]];
            bSum += b[arrayOfProp[k]];
        }
        return aSum - bSum;
    });
    for (var j = 0; j < n; j++) {
        nMost[j] = array[j];
    }
    return nMost;
};


module.exports = {

    /*
     Gets the score (positive and negative) for a character on a given day
     Input:
     {
     "characterName" : "Jon Snow",
     "date" : "2016-03-18"
     }
     */
    getSentimentForName: function (json, callback) {
        //mongodb api here, then handle the response from mongodb
		console.log(json.date);
        var end = new Date(json.date);
		end.setHours(23);
		end.setMinutes(59);
		end.setSeconds(59);
		end.setMilliseconds(999);
		end = end.toISOString();
        database.getSentimentForNameTimeframe(json.characterName, json.date, end, function (json, err) {
            if (err) {
                callback(undefined, err);
            } else {
                callback(json);
            }
        });
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
        //mongodb api here, then handle the response from mongodb
        database.getSentimentForNameTimeframe(json.name, json.startDate, json.endDate, function (json, err) {
            if (err) {
                callback(undefined, err);
            } else {
                callback(json);
            }
        });
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
        var number = json.number;
        //mongodb api here, then handle the response from mongodb
        database.getSentimentTimeframe(json.startDate, json.endDate, function (json, err) {
            if (err) {
                callback(undefined, err);
            } else {
                var res = getMostNFromArray1(json, number, "posSum");
                callback(res);
            }
        });
    },
    /*
     Same as above but most hated
     */
    worstSentiment: function (json, callback) {
        var number = json.number;
        //mongodb api here, then handle the response from mongodb
        database.getSentimentTimeframe(json.startDate, json.endDate, function (json, err) {
            if (err) {
                callback(undefined, err);
            } else {
                var res = getMostNFromArray1(json, number, "negSum");
                callback(res);
            }
        });
    },

    /*
     Same as above but with most tweeted about
     */
    mostTalkedAbout: function (json, callback) {
        var number = json.number;
        //mongodb api here, then handle the response from mongodb
        database.getSentimentTimeframe(json.startDate, json.endDate, function (json, err) {
            if (err) {
                callback(undefined, err);
            } else {
                var res = getMostNFromArray2(json, number, ["posCount", "negCount", "nullCount"]);
                callback(res);
            }
        });
    },

    /*
     returns Characters, which have the highest difference between positive and negative sentiments. Ordered.
     Still same as above
     */
    topControversial: function (json, callback) {
        var number = json.number;
        //mongodb api here, then handle the response from mongodb
        database.getSentimentTimeframe(json.startDate, json.endDate, function (json, err) {
            if (err) {
                callback(undefined, err);
            } else {
                var res = getMostNFromArray2(json, number, ["posSum", "negSum"]);
                callback(res);
            }
        });
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
        database.airDate(json.season, json.episode, function (date, error) {
            if (error) {
                callback(undefined, error);
            } else {
                var end = new Date(date.getTime() + ( 7 * 24 * 60 * 60 * 1000));
                database.getSentimentForNameTimeframe(json.name, date.toISOString(), end.toISOString(), function (json, err) {
                    if (err) {
                        callback(undefined, err);
                    } else {
                        callback(json);
                    }
                });
            }
        });
    },

    /*
     run the twitter REST API for a character to fill the database with tweets. startDate can be 2 weeks
     in the past at most
     */
    runTwitterREST: function (characterName, startDate, callback) {
        twitterAPI.getRest(characterName, startDate, new Date(), false, callback);
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