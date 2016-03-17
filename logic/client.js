var api = require('./twitterStreamingAPI');
var rest = require('./twitter_rest');

api.getStream('Jon Snow',10);
rest.launchSearch("Jon Snow", "2016-03-09", "2016-03-16");
