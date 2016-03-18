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
var specify = {
    "characterName" : "Jon Snow",
    "date" : "2016-03-18T"
};

var jonSnowTweet = gotdailysentiment.getSentimentForName(specify, 
    callback //You need to specify a callback-function, as it is an asynchronous call
);
```

Notice that you specify the analyses, which you're about to get with an JSON-Object.It contains two properties: _characterName_ and _date_.

The Method returns an array, which contains an JSON-Object with data.

The Object contains the following properties. Here it is filled with some dummy data.
```javascript
[{
  "characterName": "Jon Snow",
  "date": "2016-03-18T", //date of the tweets
  "posSum": 23, //sum of the positive sentiment score on that given day
  "negSum": 21,   //sum of the negative sentiment score on that given day
  "posCount": 11, //count of positive tweets that day
  "negCount": 5, //sum of negative tweets that day
  "nullCount": 8 //sum of neutral tweets that day
}]
```
Note that it is an Array. This Function will return only one Object, but others may return more.