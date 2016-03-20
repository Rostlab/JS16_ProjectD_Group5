var names = require('../popChars/popChars.json');
var twitter = require('./twitterAPI');
var intervalID,
    started = false;


/*
 Runs REST analysis for characters in popChars.json for the last day.
 Function is executed approx once per day per character
 */

exports.startAutomation = function (minutes) {
    if (!started){
        started=true;
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
    }else{
        throw Error('Tried to start the Automationprocess a second time!');
    }
};

exports.stopAutomation = function () {
    if (started){
        started=false;
        clearInterval(intervalID);
    }else{
        throw Error('Tried to stop the Automationprocess a second time!');
    }
};




