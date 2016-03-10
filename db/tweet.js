var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create schema
var tweetSchema = new Schema({
	id: String,
	characterName: String,
	createda_at: Date,
	sentiment: Number
});

var Tweet = mongoose.model('Tweet', tweetSchema);
// make this available to our users in our Node applications
module.exports = Tweet;

/* to get this model use:
var Tweet = require('./db/tweet');
*/