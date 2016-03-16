var should= require('should');
var api = require ('../index.js'); //In index.js should be the export method. TODO

describe('API gets tested', function (){
	describe('getSentimentForName(name,date)',function(){
		context.skip('Name is present and on the Specific day exists a Tweet',function(){
			var list = ['Jon Snow', 'Tyrion Lennister', 'Daenery Targaryen', 'Arya Stark', 'Khal Drogo', 'Joffrey Baratheon'];//automation... but needs approval if something in the DB exists.
			var date = new Date();
			it ('should return the Sentiment for Jon Snow on 16.03.2016');// Still missing!!!
			for (var i=0; i<list.length;i+=1){
				it('posSent should be positiv', function (){
					api.getSentimentForName(list[i], date).posSent.should.be.aboveOrEqual(0);
				});
				it('negSent should be negativ',function(){
					api.getSentimentForName(list[i],date).negSent.should.be.belowOrEqual(0);
				});
				it('Number of Twitter should be at least 1 - or it should have thrown',function(){
					api.getSentimentForName(list[i],date).numTweets.should.be.aboveOrEqual(1);
				});
			}

		});
		context('name is not present',function (){
			it('should throw an error with {message:\'This is not a GoT-Character\','
				+'date:new Date(2016,2,16), searchedName:\'Donald Trump\'}',function(){
				api.getSentimentForName('Donald Trump', new Date(2016,2,16)).should.throw(
					'This is not a GoT-Character',{
						date:new Date(2016,2,16), searchedName:'Donald Trump'});
			});
		});
		context('no Data for this date', function (){
			it ('should throw an Error with {message:\"For this date does no Twitterdata exist!\",'
			+ ' date:new Date(1990,1,1), searchedName:\'Jon Snow\'} ',function (){
				api.getSentimentForName('Jon Snow',new Date(1990,1,1)).should.throw(
					'For this date does no Twitterdata exist!',{
						date:new Date(1990,1,1), searchedName:'Jon Snow'
					});
			});
		});
	});
});