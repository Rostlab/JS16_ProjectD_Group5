//Added some dummy logic to test the tests :P
//The whole thing has to be done!
//Functions can be changed
//Content needs to be changed.
	var getInformation = function(startDate, EndDate) {
		if (testDate(startDate)) return;
		if (EndDate === undefined){
			//get list in 1 day start day
			return;
		}
		else{
			return;
		}

	}
	//get n biggest element from the list
	//i: position of the value in object
	var getMostNFromArray= function(array,n,property){
		var nMost = new Array(n);
		//sorting the list in decreasing oder
		listA.sort(function(a,b){return b[property] -a[property];})
		for (var j= 0;j<n;j++){
			nMost[j]= listA[j]
		}
		return nMost;
	}
	var testDate = function (date){
		var error = new Error();
		error.date = date;
		error.searchedName=name;
		if (!date) {
			throw new Error('Date is empty');
			return true	;
		}
		if (date===new Date(1990,1,1)){
			error.message="For this date does no Twitterdata exist!";
			throw error;
			return true;
		}
	}
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
		if (testDate(startDate)) return;
		if (endDate === undefined) {
				//no endDate => search in startDate
			return module.getSentimentForName(name,startDate);

			}
		else {
			if (testDate(endDate)) return;
			//TODO: need more information how is listA now when we have endDate
		}
	},
	//returns Array of names, which are most loved. with length=number. Ordered!
	topSentiment: function(number, startDate,endDate){
		//TODO
		if (testDate(startDate)) return;
		if (endDate === undefined) {
			nMost = getMostNFromArray(listA,"posSent");
			return nMost;
		}
		else{
			if (testDate(endDate)) return;
			nMost = getMostNFromArray(listA,"posSent");
			return nMost;
		}
	},
	//returns Array of most hated Characternames. Ordered.
	worstSentiment: function(number, startDate, endDate){
		//TODO
		if (testDate(startDate)) return;
		if (endDate === undefined) {
			nMost = getMostNFromArray(listA,"negSent");
			return nMost;
		}
		else{
			if (testDate(endDate)) return;
			nMost = getMostNFromArray(listA,"negSent");
			return nMost;
		}
	},
	//returns Array of Characters, where the most Tweets exist in a certain Timeframe. Ordered!
	mostTalkedAbout: function(number,startDate, endDate){
		//TODO
		if (testDate(startDate)) return;
		if (endDate === undefined) {
			nMost = getMostNFromArray(listA,"numTweets");
			return nMost;
		}
		else{
			if (testDate(endDate)) return;
			nMost = getMostNFromArray(listA,"numTweets");
			return nMost;
		}
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