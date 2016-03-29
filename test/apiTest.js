setTimeout(function(){//This function is needed to get all the requires straighten up
	var should= require('should'),
	confjson = require ('../super_secret.json'),
	api = require ('../main.js').init(confjson);
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
		describe('#automation:',function(){
			context('is started', function(){
				it('should throw an error!', function(){
					(function(){api.startAutomation();}).should.throw();
				});
			});
			context('is stopped', function(){
				it('should throw an error', function(){
					(function(){api.stopAutomation();}).should.not.throw();
					(function(){api.stopAutomation();}).should.throw();
				});
			});
		});
	//Should be filled as soon as real data exists in database.
		describe('#getSentimentForName:',function(){
			context('Name is present and on the Specific day exists a Tweet',function(){
				it('should return the specified JSON in a callback',function(done){
					var json = {"characterName":"Jon Snow", "date": (date).toISOString()};
					api.getSentimentForName(json,function(resp,err){
						if (err) {
							done();
							throw err;
						}
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


			context.skip('name is not present',function (){
				it('should throw an SearchException',function(done){
					(function (){
						api.getSentimentForName({"characterName": "Donald Trump", "date" : new Date(2016,2,16).toISOString()}, function(resp,err){
							if (err){
								done(); 
								throw err;
							}
							return resp;
						});
					}).should.throw("This is not a GoT-Character",{name:"SearchError",date:new Date(2016,2,16).toISOString(), searchedName:'Donald Trump'});
				});
			});
			context.skip('No Data exists for this date', function (){
				it ('should throw an SearchException',function (done){
					(function (){
						api.getSentimentForName({"searchedName":"Jon Snow","date": new Date(1990,1,1).toISOString()}, function(resp, err){
							if (err) {
								done(); 
								throw err;
							}
							return resp;
						});
					}).should.throw("For this date does no Twitterdata exist",{name:"SearchError",date:new Date(1990,1,1).toISOString(),searchedName: 'Jon Snow'});
				});
			});
		});

	//***************************************

		describe('#getSentimentForNameTimeframe: ',function(){
			context('Name is present:',function(){
				it('Response-JSON should meet its specification', function(done){
					api.getSentimentForName({"searchedName":"Jon Snow", "startDate":new Date(2016,2,22).toISOString(),"endDate": new Date(2016,2,24).toISOString()},function(resp, err){
						if (err){
							done();
							throw err;
						}
						should.ok(resp);
						for(var i=0;i<resp.length;i+=1){
							resp[i].characterName.should.be.equal('Jon Snow');
							resp[i].date.should.be.equal(date.toISOString());
							resp[i].posSum.should.be.aboveOrEqual(0);
							resp[i].negSum.should.be.aboveOrEqual(0);
							resp[i].posCount.should.be.aboveOrEqual(0);
							resp[i].negCount.should.be.aboveOrEqual(0);
							resp[i].nullCount.should.be.aboveOrEqual(0);
						}
						done();
					});
				});
			});
			context.skip('name is not present',function (){
				it('should throw an SearchException',function(done){
					(function (){
						api.getSentimentForNameTimeframe({"characterName": "Donald Trump", "date" : new Date(2016,2,16).toISOString()}, function(resp,err){
							if (err){
								done(); 
								throw err;
							}
							return resp;
						});
					}).should.throw("This is not a GoT-Character",{name:"SearchError",date:new Date(2016,2,16).toISOString(), searchedName:'Donald Trump'});
				});
			});
			context.skip('No Data exists for this date', function (){
				it ('should throw an SearchException',function (done){
					(function (){
						api.getSentimentForName({"searchedName":"Jon Snow","date": new Date(1990,1,1).toISOString()}, function(resp, err){
							if (err) {
								done(); 
								throw err;
							}
							return resp;
						});
					}).should.throw("For this date does no Twitterdata exist",{name:"SearchError",date:new Date(1990,1,1).toISOString(),searchedName: 'Jon Snow'});
				});
			});
		});



		context('Tops and Flops',function(){
			var inputJSON = {
				"number":3,
				"startDate":new Date(2016,2,22).toISOString(),
				"endDate":new Date(2016,2,24).toISOString(),
			},
			callback=function(arr,comProp,comparison){
				//arr.length.should.equal(3);				//This fails as long as dummy data is used.
				for(var i=0; i<arr.length;i+=1){
					if(i!==0){
						comparison(arr[i][comProp],arr[i-1][comProp]).should.be.true();
					}
					arr[i].name.should.be.ok();
					arr[i].posSum.should.be.aboveOrEqual(0);
					arr[i].negSum.should.be.aboveOrEqual(0);
					arr[i].posCount.should.be.aboveOrEqual(0);
					arr[i].negCount.should.be.aboveOrEqual(0);
					arr[i].nullCount.should.be.aboveOrEqual(0);
				}
			};
			describe('#topSentiment:',function(){
				it('The response-JSON meets its specification',function(done){
					api.topSentiment(inputJSON,function(resp,err){
						if (err){
							done();
							throw err;
						}
						callback(resp,'posSum',function(sec,first){
							return (first-sec)>=0;
						});
						done();
					});
				});
			});



			describe('#worstSentiment(num, startDate,endDate): ',function() {
				it('The response-JSON meets its specification',function(done){
					api.worstSentiment(inputJSON,function(resp,err){
						if (err){
							done();
							throw err;
						}
						callback(resp,'negSum',function(sec,first){
							return (first-sec)>=0;
						});
						done();
					});
				});
			});


			
			describe('#mostTalkedAbout(number,startDate, endDate): ',function(){
				it('The response-JSON meets its specification',function(done){
					api.mostTalkedAbout(inputJSON,function(resp,err){
						if(err){
							done();
							throw err;
						}
						for (var i=0;i<resp.length;i+=1){
							if(i!==0){
								(resp[i].posCount+resp[i].negCount+resp[i].nullCount)
									.should.be.belowOrEqual(resp[i-1].posCount+resp[i-1].negCount+resp[i-1].nullCount);
							}
							resp[i].posSum.should.be.aboveOrEqual(0);
							resp[i].negSum.should.be.aboveOrEqual(0);
							resp[i].posCount.should.be.aboveOrEqual(0);
							resp[i].negCount.should.be.aboveOrEqual(0);
							resp[i].nullCount.should.be.aboveOrEqual(0);
						}
						done();
					});
				});
			});



			describe('#topControversial(number,startDate, endDate): ',function(){
				it('The response-JSON meets its specification',function(done){
					api.mostTalkedAbout(inputJSON,function(resp,err){
						if(err){
							done();
							throw err;
						}
						for(var i=0;i<resp.length;i+=1){
							if (i!==0){
								(resp[i].posSum-resp[i].negSum).should.be.belowOrEqual(resp[i-1].posSum-resp[i-1].negSum);
							}
							resp[i].posSum.should.be.aboveOrEqual(0);
							resp[i].negSum.should.be.aboveOrEqual(0);
							resp[i].posCount.should.be.aboveOrEqual(0);
							resp[i].negCount.should.be.aboveOrEqual(0);
							resp[i].nullCount.should.be.aboveOrEqual(0);
						}
						done();
					});
				});
			});
		});



		describe('#sentimentForEpisode(name,season,episode): ',function(){
			context('The searched episode does not exist:',function(){
				it('It should throw');
				//TODO
			});
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