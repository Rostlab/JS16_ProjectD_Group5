//Added some dummy logic to test the tests :P
//The whole thing has to be done!
//Functions can be changed
//Content needs to be changed.
	var listA = [
		{name:'Jon Snow', posSent:20, negSent:-6, numTweets:40},
		{name:'Tyrion Lennister', posSent:500, negSent:-200, numTweets:3000},
		{name:'Daenery Targaryen', posSent:400, negSent:-100, numTweets:3400},
		{name:'Arya Stark', posSent:30, negSent:-50, numTweets:300}, 
		{name:'Khal Drogo',posSent:0, negSent:-1, numTweets:1},
		{name:'Joffrey Baratheon', posSent:0, negSent:-3000, numTweets:200}];
module.exports={

		// returns {posSent: Number, negSent:Number, numTweets:Number}
	getSentimentForName: function(name,date){
		var error = new Error();
		error.date = date;
		error.searchedName=name;
		//TODO
		if (!date) {throw new Error('Date is empty');}
		if (date===new Date(1990,1,1)){
			error.message="For this date does no Twitterdata exist!";
			throw error;
		}
		for (var i=0; i<listA.length;i+=1){
			
			if(listA[i].name===name){
				return {posSent:listA[i].posSent, negSent:listA[i].negSent,numTweets:listA[i].numTweets};
			}
		}
		error.message= "This is not a GoT-Character";
		throw error;
		
	},
	//returns Analysis over a timeframe (same as above)
	getSentimentForNameTimeframe: function(name, startDate,endDate){
		//TODO

	},
	//returns Array of names, which are most loved. with length=number. Ordered!
	topSentiment: function(number, startDate,endDate){
		//TODO
		
	},
	//returns Array of most hated Characternames. Ordered.
	worstSentiment: function(number, startDate, endDate){
		//TODO
	},
	//returns Array of Characters, where the most Tweets exist in a certain Timeframe. Ordered!
	mostTalkedAbout: function(number,startDate, endDate){
		//TODO
	},
	//returns Characters, which have the highest difference between positive and negative sentiments. Ordered.
	topControversial: function(number, startDate,endDate){
		//TODO
	},
	//returns sentiments for name from airing date and the week after on (season,episode).
	sentimentPerEpisode: function(name, season, episode){
		//TODO
	} 
};