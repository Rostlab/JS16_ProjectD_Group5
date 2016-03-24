
var confjson ={
		//TODO
		//Works because index.js is filled with dummy data

		"twitter" : {
	  		"consumer_key": "xxx",
	  		"consumer_secret": "xxx",
	  		"access_token_key": "xxx",
	  		"access_token_secret": "xxx"
		},
		"databaseA" : {
			"token" : "xxxxxxxxxxxxxxxxx",
			"airDateURL" : "https://got-api.bruck.me/api/episodes/find/",
			"characterNamesURL" : "https://got-api.bruck.me/api/characters/"
		},
		"automation":{
			"minutes":12	
		}
	};
setTimeout(function(){
var should= require('should'),
api = require ('../main.js').init(confjson); //In index.js should be the export method. TODO

describe('API gets tested', function (){
	var nameCol = ['Jon Snow', 'Tyrion Lennister', 'Daenery Targaryen', 'Arya Stark', 'Khal Drogo', 'Joffrey Baratheon'],//automation... but needs approval if something in the DB exists.
		date = new Date();
	describe('#init',function(){
		it('the api-object should be filled already',function(){
			should.ok(api);
			should.exist(api.startAutomation);
			should.exist(api.stopAutomation);
		});
	});
	describe('#automation: ',function(){
		context('is started: ', function(){
			it('should throw an error!', function(){
				(function(){api.startAutomation();}).should.throw();
			});
		});
		context('is stopped', function(){
			it('should throw: ', function(){
				(function(){api.stopAutomation();}).should.not.throw();
				(function(){api.stopAutomation();}).should.throw();
			});
		});
	});
//Should be filled as soon as real data exists in database.
	describe('#getSentimentForName(name,date): ',function(){
		context('Name is present and on the Specific day exists a Tweet',function(){
			it('should return the specified JSON in a callback',function(done){
				var json = {"characterName":"Jon Snow", "date": (date).toISOString()};
				api.getSentimentForName(json,function(resp,err){
					if (err) throw err;
					resp.characterName.should.be.equal('Jon Snow');
					resp.date.should.be.equal(date.toISOString());
					resp.posSum.should.be.aboveOrEqual(0);
					resp.negSum.should.be.aboveOrEqual(0);
					resp.posCount.should.be.aboveOrEqual(0);
					resp.negCount.should.be.aboveOrEqual(0);
					resp.nullCount.should.be.aboveOrEqual(0);
					done();
				});
			});
		});


//********************************************
//TODO
		context.skip('name is not present',function (){
			it('should throw an SearchException',function(done){
				(function (){
					api.getSentimentForName({"characterName": 'Donald Trump', "date" : new Date(2016,2,16)}, function(resp,err){
						if (err) throw err;
						return resp;
					});
				}).should.throw("This is not a GoT-Character",{date:new Date(2016,2,16), searchedName:'Donald Trump'});
			});
		});
		context.skip('No Data exists for this date', function (){
			it ('should throw an SearchException',function (done){
				(function (){
					api.getSentimentForName('Jon Snow', new Date(1990,1,1), function(resp, err){
						if (err) throw err;
						return resp;
					});
				}).should.throw("For this date does no Twitterdata exist",{date:new Date(1990,1,1),searchedName: 'Jon Snow'});
			});
		});
	});



	describe.skip('#getSentimentForNameTimeframe (name,startDate,endDate): ',function(){
//TODO
	});



	describe.skip('#topSentiment(num, startDate,endDate',function(){
//TODO
	});



	describe.skip('#worstSentiment(num, startDate,endDate): ',function() {
//TODO
	});


	
	describe.skip('#mostTalkedAbout(number,startDate, endDate): ',function(){
//TODO
	});



	describe.skip('#topControversial(number,startDate, endDate): ',function(){
//TODO
	});



	describe.skip('#sentimentForEpisode(name,season,episode): ',function(){
//TODO
	});



	describe.skip('#runTwitterAPI(char, startDate: ',function(){
//TODO
	});



	describe.skip('#runStreamingAPI(char, time): ',function() {
//TODO
	});



});

run();

},5000);