//Added some dummy logic to test the tests :P
//The whole thing has to be done!
//Functions can be changed
//Content needs to be changed.

module.exports = {

    /*
     Gets the score (positive and negative) for a character on a given day
     Input:
     {
     'characterName' : 'Jon Snow'
     'date' : '2016-03-18T'
     */
    getSentimentForName: function (json, callback) {
        //DUMMY RESPOSE, TO BE REPLACED
        var resp = [{
            'characterName': 'Jon Snow',
            'date': '2016-03-18T14:40:42.782Z',
            'posSum': 23,
            'negSum': 21,
            'posCount': 11,
            'negCount': 5,
            'nullCount': 8
        }]; //not that this in array and will usually contain more than one element
        callback(resp);
    },
    /*
     returns Analysis over a timeframe (same as above)
     Input json:
     {
     'name' : 'Some Name',
     'startDate' : ISODate',
     'endDate' : 'ISODate'
     }
     */
    getSentimentForNameTimeframe: function (json, callback) {
        //DUMMY RESPOSE, TO BE REPLACED
        var resp = [{
            'characterName': 'Jon Snow',
            'date': '2016-03-18T14:40:42.782Z',
            'posSum': 23,
            'negSum': 21,
            'posCount': 11,
            'negCount': 5,
            'nullCount': 8
        }]; //not that this in array and will usually contain more than one element
        callback(resp);

    },
    /*
     returns Array of names, which are most loved. with length=number. Ordered!
     Input:
     {
     'number' : 3,  //this is the count of how many you want e.g. 3 for top3
     'startDate' : ISODate',
     'endDate' : 'ISODate'
     */
    topSentiment: function (json, callback) {
        var resp = [
            {'name': 'Jon Snow'},
            {'name': 'Hodor'}];
        callback(resp);
    },
    /*
     Same as above but most hated
     */
    worstSentiment: function (json, callback) {
        var resp = [
            {'name': 'Jon Snow'}
        ];
        callback(resp);
    },
    /*
     Same as above but with most tweeted about
     */
    mostTalkedAbout: function (json, callback) {
        var resp = [
            {'name': 'Jon Snow'},
            {'name': 'Hodor'}];
        callback(resp);
    },
    /*
     returns Characters, which have the highest difference between positive and negative sentiments. Ordered.
     Still same as above
     */
    topControversial: function (json, callback) {
        var resp = [
            {'name': 'Jon Snow'},
            {'name': 'Hodor'}];
        callback(resp);
    },
    /*
     returns sentiments for name from airing date and the week after on (season,episode).
     Input:
     {
     'name' : 'Jon Snow',
     'season' : 1,
     'episode' : 1
     }
     */
    sentimentPerEpisode: function (json, callback) {
        var resp = [{
            'name': json.name,
            'posSum': 23,
            'negSum': 21,
            'posCount': 11,
            'negCount': 5,
            'nullCount': 8
        }];
        callback(resp);
    },
    runTwitterREST: function (characterName, startDate){
        //TODO
    },
    runTwitterStreaming: function (characterName, duration){
        //TODO
    }
};