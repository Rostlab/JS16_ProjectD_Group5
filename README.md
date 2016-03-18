# gotdailysentiment
Joffrey Baratheon is one of the most loathed characters in TV history. As a matter of fact people were celebrating his TV death on Twitter. We are interested to learn more on how people feel about different characters by analyzing tweets mentioning GoT characters. This package provides you with functions, which will return interesting Data about Tweets on characters from "Game of Thrones".

## Installation
```
npm install gotdailysentiment
```

## Usage
```javascript
var gotdailysentiment= require(gotdailysentiment);
```

## Get a small amout of data
```javascript
var json = {
    "characterName" : "Jon Snow",
    "date" : "2016-03-18T"
};

var jonSnowTweet = gotdailysentiment.getSentimentForName(json, 
    callback //You need to specify a callback-function, as it is an asynchronous call
);
```

Notice that you specify the analyses, which you're about to get with an JSON-Object.It contains two properties: _characterName_ and _date_.

The Method returns a JSON-Object with the data. It contains the following properties. Here it is filled with some dummy data.
```javascript
{
  "characterName": "Jon Snow", 
  "date": "2016-03-18T", //date of the tweets
  "posSum": 23,          //sum of the positive sentiment score on that given day
  "negSum": 21,          //sum of the negative sentiment score on that given day
  "posCount": 11,        //count of positive tweets that day
  "negCount": 5,         //sum of negative tweets that day
  "nullCount": 8         //sum of neutral tweets that day
}
```

## Get more data!
The following functions provide you with more data. All functions get a JSON-Object, where you specify you're query, and a callback-function as parameters.

### Timeframe
This function looks up the data for a certain timeframe. It gets the following JSON-Object:
```javascript
var json = {
     "name" : "Some Name",
     "startDate" : "ISODate",
     "endDate" : "ISODate"
};

gotdailysentiment.getSentimentForNameTimeframe(json,callback); 
```
It returns an Array where the same JSON-Objects are stored as described above at **"Get a small amount of data"**. Per day of the timeframe there is one JSON-Object in this Array.

### Tops and Flops
Those four functions provide you with the characters, which get the most positive sentiments at Twitter - or the most negative ones.
You decide how many characters you want in your Top-list. For that reason there is a *number*-property in the JSON-Object:
```javascript
var json = {
    "number" : 3,            //this is the count of how many you want e.g. 3 for top3
    "startDate" : "ISODate", //This is for specifying a timefram like the Timeframe-function above
    "endDate" : "ISODate"
};

var top3chars = gotdailysentiment.topSentiment(json, callback);
var worst3chars = gotdailysentiment.worstSentiment(json, callback);
var mostTwittered = gotdailysentiment.mostTalkedAbout(json, callback);
var controversial = gotailysentiment.topControversial(json, callback);
```

`controversial` contains the characters, which have the greatest difference between the value `posSum` and `negSum`.

All functions return an Array, which contains JSON-Objects. 
Note, that this time there exists for every Character only **one** object, e.g. when you assign three to the `number`-property, the array contains three objects. The objects contain the following properties (filled with dummy-data):
```javascript
{
    "name": "Jon Snow",
    "posSum": 23,
    "negSum": 66,
    "posCount": 11,
    "negCount": 5,
    "nullCount": 8
}
```

### Feeling about Episodes
With this function you get the sentiments on a character for the specified episode and the following seven days. So you have to define the following JSON-Object:
```javascript
var json = {
     "name" : "Jon Snow",
     "season" : 1,
     "episode" : 1
}

var jonSnow1_1 = gotdailysentiment.sentimentPerEpisode(json,callback);
```

It returns one JSON-Object (dummy-data):
```
{
    "name": "Jon Snow",
    "posSum": 23,
    "negSum": 21,
    "posCount": 11,
    "negCount": 5,
    "nullCount": 8
}
```

## Production
As the Twitter-APIs have some restrictions, this package populates an own database for tweets. Please make sure to run the following functions continously over your Software-Life-Cycle.

```javascript
function runTwitterREST (characterName, startDate); //startDate can be max 2 weeks in the past. Run it two populate the database with tweets.

function runTwitterStreaming (characterName, duration); // runs the twitter streaming API to fill the database for a character and a duration in seconds.
```

