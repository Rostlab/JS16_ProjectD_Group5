var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create schema
var tweetSchema = new Schema({
    //unique id of the tweet
    id: {type: String, required: true, unique : true},
    //the search term used to find the tweet
    characterName: {type: String, required: true},
    //Date the tweet was created at
    created_at: {type: Date, required: true},
    //Original text of the tweet
    text: {type: String, required: true},
    //retweet count
    retweeted: {type: Number, default: 0},
    //favourite count
    fav: {type: Number, default: 0},
    //language of the tweet
    lang: {type: String, default: "en"}
});

var Tweet = mongoose.model('Tweet', tweetSchema);
// make this available to our users in our Node applications
module.exports = Tweet;

/* to get this model use:
 var Tweet = require('./db/tweet');
 */