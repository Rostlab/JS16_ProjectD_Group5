var automation = require('./logic/automate.js');
var twitterAPI = require('./logic/twitterAPI.js');
var database = require('./db/database.js');


//start automation as default
automation.startAutomation();

//Error handling

var SearchError = function (message, date, searchedName) {
    this.name = 'SearchError';
    this.message = message || 'Some Failure happened while searching for a SentimentAnalysis';
    this.stack = (new Error()).stack;
    this.date = date;
    this.character = searchedName;
};

SearchError.prototype = Object.create(Error.prototype);
SearchError.prototype.constructor = SearchError;
/*
 Checks if the name and date combination are valid inputs. false -> bad input. true -> good input
 */
var inputValidation = function (json) {
    var nameTest = true;
    if (json.hasOwnProperty("number")) {
        nameTest = isNaN(json.number);
    }
    if (json.hasOwnProperty("character")) {
        nameTest = (!json.character && 0 === json.character.length);
    }
    var dateTest = true;
    if (json.hasOwnProperty("date")) {
        dateTest = isNaN(Date.parse(json.date));
    }
    if (json.hasOwnProperty("startDate") && json.hasOwnProperty("endDate")) {
        dateTest = isNaN(Date.parse(json.startDate)) || isNaN(Date.parse(json.endDate));
    }
    return !(nameTest || dateTest);
};

var calculateTopSum = function (array, n, properties) {
    var result = [];
    //combine entries for same character names
    array.reduce(function (previousValue, currentValue, currentIndex, array) {
        var exists = false;
        var pos;
        for (var i = 0; i < result.length; i++) {
            if (currentValue.character === result[i].character) {
                exists = true;
                pos = i;
                break;
            }
        }
        if (exists) {
            result[pos].posSum = result[pos].posSum + currentValue.posSum;
            result[pos].negSum = result[pos].negSum + currentValue.negSum;
            result[pos].posCount = result[pos].posCount + currentValue.posCount;
            result[pos].negCount = result[pos].negCount + currentValue.negCount;
            result[pos].nullCount = result[pos].nullCount + currentValue.nullCount;
        } else {
            result.push(currentValue);
        }
        return result;
    }, result); //initial value is result end of callback function for reduce
    //sort result by property
    result.sort(function (a, b) {
        var aSum = 0;
        var bSum = 0;
        for (var j = 0; j < properties.length; j++) {
            aSum += a[properties[j]];
            bSum += b[properties[j]];
        }
        return bSum - aSum;
    });
    //select top n from result array
    result = result.slice(0, n);
    return result;
};

module.exports = {

    /*
     Gets the score (positive and negative) for a character on a given day
     Input:
     {
     "character" : "Jon Snow",
     "date" : "2016-03-18"
     }
     */
    getSentimentForName: function (json, callback) {
        //validate input
        if (!inputValidation(json)) {
            var inputError = new SearchError('invalid input');
            callback(undefined, inputError);
            return;
        }
        //make end date last millisecond of the day
        var end = new Date(json.date);
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);
        end.setMilliseconds(999);
        end = end.toISOString();
        //ensure start date is at 00:00:000
        var start = new Date(json.date);
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        start.setMilliseconds(0);
        start = start.toISOString();

        database.getSentimentForNameTimeframe(json.character, start, end, function (json, err) {
            if (err) {
                callback(undefined, err);
            } else {
                var result = {};
                var posSentDaily = 0;
                var negSentDaily = 0;
                var posDaily = 0;
                var negDaily = 0;
                var nullDaily = 0;
                for (var i in json) {
                    posSentDaily += json[i].posSum;
                    negSentDaily += json[i].negSum;
                    posDaily += json[i].posCount;
                    negDaily += json[i].negCount;
                    nullDaily += json[i].nullCount;
                }
                result.character = json[0].character;
                result.description = json[0].description;
                result.posSum = posSentDaily;
                result.negSum = negSentDaily;
                result.posCount = posDaily;
                result.negCount = negDaily;
                result.nullCount = nullDaily;
                result.date = start;
                callback(result);
            }
        });
    },

    /*
     returns Analysis over a timeframe (same as above)
     Input json:
     {
     "character" : "Some Name",
     "startDate" : ISODate",
     "endDate" : 'ISODate"
     }
     */
    getSentimentForNameTimeframe: function (json, callback) {
        //validate input
        if (!inputValidation(json)) {
            var inputError = new SearchError('invalid input');
            callback(undefined, inputError);
            return;
        }
        //mongodb api here, then handle the response from mongodb
        database.getSentimentForNameTimeframe(json.character, json.startDate, json.endDate, function (json, err) {
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
        //validate input
        if (!inputValidation(json)) {
            var inputError = new SearchError('invalid input');
            callback(undefined, inputError);
            return;
        }
        var number = json.number;
        //mongodb api here, then handle the response from mongodb
        database.getSentimentTimeframe(json.startDate, json.endDate, function (json, err) {
            if (err) {
                callback(undefined, err);
            } else {
                var res = calculateTopSum(json, number, ["posSum"]);
                callback(res);
            }
        });
    },
    /*
     Same as above but most hated
     */
    worstSentiment: function (json, callback) {
        //validate input
        if (!inputValidation(json)) {
            var inputError = new SearchError('invalid input');
            callback(undefined, inputError);
            return;
        }
        var number = json.number;
        //mongodb api here, then handle the response from mongodb
        database.getSentimentTimeframe(json.startDate, json.endDate, function (json, err) {
            if (err) {
                callback(undefined, err);
            } else {
                var res = calculateTopSum(json, number, ["negSum"]);
                callback(res);
            }
        });
    },

    /*
     Same as above but with most tweeted about
     */
    mostTalkedAbout: function (json, callback) {
        //validate input
        if (!inputValidation(json)) {
            var inputError = new SearchError('invalid input');
            callback(undefined, inputError);
            return;
        }
        var number = json.number;
        //mongodb api here, then handle the response from mongodb
        database.getSentimentTimeframe(json.startDate, json.endDate, function (json, err) {
            if (err) {
                callback(undefined, err);
            } else {
                var res = calculateTopSum(json, number, ["posCount", "negCount", "nullCount"]);
                callback(res);
            }
        });
    },

    /*
     returns Characters, which have the highest difference between positive and negative sentiments. Ordered.
     Still same as above
     */
    topControversial: function (json, callback) {
        //validate input
        if (!inputValidation(json)) {
            var inputError = new SearchError('invalid input');
            callback(undefined, inputError);
            return;
        }
        var number = json.number;
        //mongodb api here, then handle the response from mongodb
        database.getSentimentTimeframe(json.startDate, json.endDate, function (json, err) {
            if (err) {
                callback(undefined, err);
            } else {
                var res = calculateTopSum(json, number, ["posSum", "negSum"]);
                callback(res);
            }
        });
    },

    /*
     returns sentiments for name from airing date and the week after on (season,episode).
     Input:
     {
     "character" : "Jon Snow",
     "season" : 1,
     "episode" : 1
     }
     */
    sentimentPerEpisode: function (json, callback) {
        if (json.character.length !== 0 && !isNaN(json.episode) && !isNaN(json.season)) {
            database.airDate(json.season, json.episode, function (date, error) {
                if (error) {
                    callback(undefined, error);
                } else {
                    var end = new Date(date.getTime() + ( 7 * 24 * 60 * 60 * 1000));
                    database.getSentimentForNameTimeframe(json.character, date.toISOString(), end.toISOString(), function (json, err) {
                        if (err) {
                            callback(undefined, err);
                        } else {
                            callback(json);
                        }
                    });
                }
            });
        } else {
            var invalid = new SearchError('Invalid character / season / episode', undefined, json.character);
            callback(undefined, invalid);
        }
    },

    /*
     run the twitter REST API for a character to fill the database with tweets. startDate can be 2 weeks
     in the past at most
     */
    runTwitterREST: function (character, startDate, callback) {
        twitterAPI.getRest(character, startDate, new Date().toISOString(), false, callback);
    },

    /*
     runs the twitter streaming API to fill the database for a character and a duration in seconds
     */
    runTwitterStreaming: function (character, duration, callback) {
        twitterAPI.getStream(character, duration, false, callback);
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