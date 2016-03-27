/*
 This script builds the json files with the raw data

 It uses data from project A and the wiki data from
 https://rostlab.org/~gyachdav/awoiaf/Data/pageRank/
 the data from the link needs to be saved to the popChars/data/ folder
 */


var fs = require('fs');
var path = require('path');
var process = require("process");
var db = require('../db/database');
var dir = "./data";


var buildJSON = function (callback) {
    fs.readdir(dir, function (err, files) {
        var json = [];
        if (err) {
            console.log('error: ' + err);
            process.exit(1);
        }

        files.forEach(function (file, index) {
            fs.readFile("data/" + file, {encoding: 'utf-8'}, function (err, data) {
                var charName = file.toString().slice(0, -5).replace(/_/g, " ");
                var score = (data.toString().split(' '))[1].slice(0, -1);
                json.push({
                    "name": charName,
                    "score": score
                });
                if (charName === 'Zollo') {
                    callback(json)
                }

            });
        });

    });
};

buildJSON(function (json) {
    var filename = 'wikilist.json';
    fs.writeFile(filename, JSON.stringify(json, null, 4), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("success");
        }
    })
});

db.characterNames(function (json) {
    var filename = 'chars.json';
    fs.writeFile(filename, JSON.stringify(json, null, 4), function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("success");
        }
    })
});