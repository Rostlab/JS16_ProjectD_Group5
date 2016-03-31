![](./gotsentimentlogo.png)
# gotdailysentiment
Joffrey Baratheon is one of the most loathed characters in TV history. As a matter of fact people were celebrating his TV death on Twitter. We are interested to learn more on how people feel about different characters by analyzing tweets mentioning GoT characters. This package provides you with functions, which will return interesting Data about Tweets on characters from "Game of Thrones".

## Installation
```
npm install gotdailysentiment
```

## Usage
First you have to require the Package. Then you have to configurate the database, which you are gonna use to store the Twitter-data on the long run. For that purpose use the function `init`. This will setup the configuration and start the automatic update-process (for more see **automatic analyses**). If no error occurs it returns an object with all functions, which are now accessible: 
```javascript
var initPack = require('gotdailysentiment');

var gotdailysentiment = initPack.init(config);
```
The config-JSON needs to specify the following properties:
```javascript
{
  "twitter": {            //Twitter devloper credentials
    "consumer_key": "xxxxx",
    "consumer_secret": "xxxxx",
    "access_token_key": "xxxxx",
    "access_token_secret": "xxxxx"
  },
  "database": {           //The Database you're gonna use to store your data of the analyses
    "airDateURL": "xxxxx",
    "characterNamesURL": "xxxxx",
    "sentimentSave": "xxxxx",
    "sentimentGetChar": "xxxxx",
    "sentimentGetAll": "xxxxx"
  },
  "automation": {
    "minutes": 12
  }
}
```
**Note that you have to do the configuration to use this package.**
You will need valid Twitter developer credentials. You can get these [here](https://apps.twitter.com/).

If you call `init` a second time, after a successful configuration, you can't change the configuration anymore. Instead it will only return the same object containing the accessible functions as before.
## Get a small amout of data
```javascript
var json = {
    "characterName" : "Jon Snow",
    "date" : "2016-03-18T"
};

gotdailysentiment.getSentimentForName(json, 
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
It gives the callback an Array, where the same JSON-Objects are stored as described above at **"Get a small amount of data"**. It depends on the automatic update interval, how many objects are stored in the array. If set to 12 you get a result per day of your timeframe.

### Tops and Flops
Those four functions provide you with the characters, which get the most positive sentiments at Twitter - or the most negative ones.
You decide how many characters you want in your Top-list. For that reason there is a *number*-property in the JSON-Object:
```javascript
var json = {
    "number" : 3,            //this is the count of how many you want e.g. 3 for top3
    "startDate" : "ISODate", //This is for specifying a timeframe
    "endDate" : "ISODate"
};

gotdailysentiment.topSentiment(json, callback);
gotdailysentiment.worstSentiment(json, callback);
gotdailysentiment.mostTalkedAbout(json, callback);
gotailysentiment.topControversial(json, callback);
```

`topControversial` computes the characters, which have the greatest difference between the value `posSum` and `negSum`.

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

### Feelings about Episodes
With this function you get the sentiments on a character for the specified episode and the following seven days. So you have to define the following JSON-Object:
```javascript
var json = {
     "name" : "Jon Snow",
     "season" : 1,
     "episode" : 1
}

gotdailysentiment.sentimentPerEpisode(json,callback);
```

The callback gets one JSON-Object (In this case dummy-data):
```javascript
{
    "name": "Jon Snow",
    "posSum": 23,
    "negSum": 21,
    "posCount": 11,
    "negCount": 5,
    "nullCount": 8
}
```

## Automatic analyses
As mentioned earlier, with the `init`-function, you start the automatical analyses of the Tweets. It starts every 12 minutes unless you've specified something else in the congifurations Every 12 minutes this function takes one of the most popular characters and looks up all Tweets about this character since the last time. These Tweets get analyzed and after that the result gets stored in the Database, as one result. It stores **one** result per analyses-run. You get the finest possible granularity with the default intervall, as the Twitter API limits the queries to their Databases. With the default every Character gets updated once per day.

If you want to stop the automation you may do this with the following function:
```javascript
gotdailysentiment.stopAutomation();
```
If you want to start the Automation again, you do this with `startAutomation()`:
```javascript
gotdailysentiment.startAutomation(); 
```

If you start the automationprocess, though it already had been started, you get an Error. Same goes for the stop.

### Additional possibilities
All queries work with the data, which is stored in the database. Sometimes it happens that there is no data stored about a minor important character or if you set the update-interval to high, there may be stored data, which is very old.

If something like this happens you can use the following functions to get customized analyses data, without storing it in the database:

```javascript
function runTwitterREST (characterName, startDate, callback); //startDate can be max 2 weeks in the past.

function runTwitterStreaming (characterName, duration, callback);
```
`runTwitterRest` analyses the tweets about `charactername` from `startDate` till today.

If you want to have real time analyses you need to use the function `runTwitterStreaming` and set the `duration`-parameter to the time, how long you want to be watching Twitter.

Both functions give the result as the following json-object to the callback-function:
```javascript
{
    "name": "Jon Snow",
    "posSum": 23,
    "negSum": 21,
    "posCount": 11,
    "negCount": 5,
    "nullCount": 8
}
```

###Errors
If there is wrong user input or user input which can't be computed, e.g. searching for sentiments late in 1990, the second argument of the callback  contains a `SearchError`.

The following fields can be filled in the Error.
```javascript
    this.name='SearchError';
    this.message= message || 'Some Failure happened while searching for a SentimentAnalyses';
    this.stack= (new Error()).stack;
    this.date= date;                    //This argument gets only filled if the reason for the error could be a wrong user input.
    this.searchedName= searchedName;    //Same goes for this one.
```
