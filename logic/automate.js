var names = require('../popChars/popChars.json');
var twitter = require('./twitterAPI');
var intervalID;


/*
 Runs REST analysis for characters in popChars.json for the last day.
 Function is executed approx once per day per character
 */

exports.startAutomation = function (minutes) {
    if (minutes === undefined) {
        minutes = 12;
    }
    var interval = minutes * 60 * 1000;
    var currentPos = 0;

    intervalID = setInterval(function () {

        var currentDate = new Date();
        var twoDaysAgo = currentDate.setDate(currentDate.getDay() - 2);

        twitter.getRest(names[currentPos].name,twoDaysAgo,currentDate);
        currentPos = (currentPos + 1) % names.length;

    }, interval); // interval is set here
};

exports.stopAutomation = function () {
    clearInterval(intervalID);
};




