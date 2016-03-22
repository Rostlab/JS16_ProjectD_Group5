# gotdailysentiment
Joffrey Baratheon is one of the most loathed characters in TV history. As a matter of fact people were celebrating his TV death on Twitter. We are interested to learn more on how people feel about different characters by analyzing tweets mentioning GoT characters. This package provides you with functions, which will return interesting Data about Tweets on characters from "Game of Thrones".

## Installation
```
npm install gotdailysentiment
```

## Usage
First you have to require the Package. Then you have to configurate the database, which you are gonna use to store the Twitter-data on the long run. For that purpose use the function `init`. This will setup the configuration and start the automatic update-process (for more see **automatic update**). If no error occurs it returns an object with all functions, which are now accessible: 
```javascript
var initPack = require('gotdailysentiment');

var gotdailysentiment = initPack.init(config);
```
The config-JSON needs to specify the following properties:
```javascript
{
  "twitter" : {             //These are the access tokens to the Twitter-API
      "consumer_key": "xxx",
      "consumer_secret": "xxx",
      "access_token_key": "xxx",
      "access_token_secret": "xxx"
  },
  "database" : {            //This is the access to the database, where the tweets are stored by the package
    "user" : "Username goes here",
    "password" : "Password here",
    "port" : "808080",
    "uri" : "uri to mongoDB",
    "name" : "name of mongoDB"
  },
  "databaseA" : {         //This is the access token to access the databse from https://github.com/Rostlab/JS16_ProjectA
    "token" : "xxxxxxxxxxxxxxxxx"
  }
}
```
**Note that you have to do the configuration to use this package.**

If you call `init` a second time, after a successful configuration, you can't change the configuration anymore. Instead it will only return the same object as before.
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

Note that you specify the analyses, which you're about to get with an JSON-Object. It contains two properties: _characterName_ and _date_.

The function gives a JSON-Object with the data to the callback-function. It contains the following properties. Here it is filled with some dummy data.
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
The following functions provide you with more "customized" data. All functions get a JSON-Object, where you specify your query, and a callback-function as parameters.

### Timeframe
This function looks up the data for a certain timeframe. It gets the following JSON-Object as parameter:
```javascript
var json = {
     "name" : "Some Name",
     "startDate" : "ISODate", //ISODate means: <JJJJ-MM-DD>T<hh:mm:ss>
     "endDate" : "ISODate"
};

gotdailysentiment.getSentimentForNameTimeframe(json,callback); 
```
It gives the callback an Array, where the same JSON-Objects are stored as described above at **"Get a small amount of data"**. Per day in the timeframe there is one JSON-Object in this array.

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

All functions give the callback an array, which contains JSON-Objects. 
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

The callback gets one JSON-Object (In this case dummy-data):
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

## Automatic update
As the Twitter-APIs have some restrictions, this package populates an own database for tweets. It contiuously pulls the data of the last 2 days from twitter for the 117 most popular characters and stores this data in the Database, which you've specified in the initialization-step.

By default it updates every 12 minutes the data for one character, so every character gets updated per day. You may stop this automation with the following function:
```javascript
gotdailysentiment.stopAutomation();
```
If you want to start the Automation again, you do this with `startAutomation()`. Here you've got the possibility to specify the interval as a number-parameter. The default is 12.
```javascript
gotdailysentiment.startAutomation(100); //every 100 minutes it will pull data from Twitter.
```
Note that we recommend not to use a value, which is less then 10, as the Twitter-API does'nt allow a query so often.

If you start the automationprocess, though it already had been started, you get an Error. Same goes for the stop.

### Additional possibilities
If you want to be certain, that the database is up to date for a special character, use the following commands. The REST-Method allows to search for Tweets in the past (Maximum 2 weeks ago!). The Streaming data scrapes real time data.

```javascript
function runTwitterREST (characterName, startDate); //startDate can be max 2 weeks in the past. Run it to populate the database with tweets.

function runTwitterStreaming (characterName, duration); // runs the twitter streaming API to fill the database for a character and a duration in seconds.
```

