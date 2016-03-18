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

## get sentiments of a certain date from one character
```javascript
var jonSnowTweet = gotdailysentiment.getSentimentForName({
    'characterName' : 'Jon Snow',    'date' : new Date()
    }, somecallbackfunction);
```
Notice that you specify the analyses, which you're about to get with an JS-Object, which contains two properties: _characterName_ and _date_.

Returns an Array, which contains for every Tweet, which meets the specification, an Object.

The Object contains the following properties. Here it is filled with some dummy data.
```javascript
[{
  'characterName': 'Jon Snow',
  'date': json.date, //date of the tweets
  'posSum': 23, //sum of the positive sentiment score on that given day
  'negSum': 21,   //sum of the negative sentiment score on that given day
  'posCount': 11, //count of positive tweets that day
  'negCount': 5, //sum of negative tweets that day
  'nullCount': 8 //sum of neutral tweets that day
}]
```
Note that it is an Array. This Function will return only one Object, but others may return more.
