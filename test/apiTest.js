setTimeout(function(){//This function is needed to get all the requires straighten up
	var should= require('should'),
	confjson = require ('../super_secret.json'),
	wholeDataArray = require ('../test/testData.json'),
	dataArray = [];
	api = require ('../main.js').init(confjson);
	var oneDateData = wholeDataArray.filter(function f (elem){
		var wish = new Date(wholeDataArray[0].date);
		elem = new Date(elem.date);
		if (wish.getFullYear()!==elem.getFullYear()){
			return false;
		}
		if (wish.getMonth()!==elem.getMonth()){
			return false;
		}
		if (wish.getDate()!==elem.getDate()){
			return false;
		}
		return true;
	});
	for (var yps =0; Math.min(oneDateData.length,5)>yps; yps+=1){
		while(true){
			dataArray[yps] = oneDateData[Math.floor(Math.random()*(oneDateData.length))];
			if (dataArray[yps].description ==='Group 5'){
				break;
				//Asserts that only data from GROUP5 is used.
			}
		}
	}
	describe('API gets tested', function (){
		this.timeout(3000);
		var date = new Date();
		describe('#init',function(){
			it('the api-object should be filled already',function(){
				should.ok(api);
				should.exist(api.startAutomation);
				should.exist(api.stopAutomation);
			});
		});
		describe('#automation:',function(){
			describe('is started', function(){
				it('should throw an error!', function(){
					(function automStart(){api.startAutomation();}).should.throw();
				});
			});
			describe('is stopped', function(){
				it('should throw an error', function(){
					(function automStopFirst(){api.stopAutomation();}).should.not.throw();
					(function automStopSec(){api.stopAutomation();}).should.throw();
				});
			});
		});
	//Should be filled as soon as real data exists in database.
		describe('#getSentimentForName:',function(){
			describe('Name is present and on the Specific day exists a Tweet',function(){
				

					var loopfunction = function(data){
							it('should return the specified JSON for '+data.character,function(done){
							var json = {"character":data.character, "date": data.date};
							var compDate;
							api.getSentimentForName(json,function(resp,err){
								if (err) {
									done();
									throw err;
								}
								resp.character.should.be.equal(data.character);
								compDate = new Date(data.date);
								(new Date(resp.date)).should.be.equal(new Date(compDate.getFullYear(),compDate.getMonth(),compDate.getDate()));
								resp.posSum.should.be.equal(data.posSum);
								resp.negSum.should.be.equal(data.negSum);
								resp.posCount.should.be.equal(data.posCount);
								resp.negCount.should.be.equal(data.negCount);
								resp.nullCount.should.be.equal(data.nullCount);
								done();
							});
						});
					};
					for (var i=0; i<dataArray.length; i+=1){
						loopfunction(dataArray[i]);
					}
			});


			describe.skip('name is not present',function (){
				it('should throw an SearchException',function(done){
					(function getSenForNameNotPresent(){
						api.getSentimentForName({"character": "Donald Trump", "date" : new Date(2016,2,16).toISOString()}, function(resp,err){
							if (err){
								done(); 
								throw err;
							}
							return resp;
						});
					}).should.throw("This is not a GoT-Character",{name:"SearchError",date:new Date(2016,2,16).toISOString(), character:'Donald Trump'});
				});
			});
			describe.skip('No Data exists for this date', function (){
				it ('should throw an SearchException',function (done){
					(function getSenForNameNO_DATA(){
						api.getSentimentForName({"character":"Jon Snow","date": new Date(1990,1,1).toISOString()}, function(resp, err){
							if (err){
								done(); 
								throw err;
							}
							return resp;
						});
					}).should.throw("For this date does no Twitterdata exist",{name:"SearchError",date:new Date(1990,1,1).toISOString(),character: 'Jon Snow'});
				});
			});
		});

		describe('#getSentimentForNameTimeframe: ',function(){
			describe('Name is present:',function(){
				var loopfunction = function(data){
					it('Response-JSON checked for '+data.character, function(done){
						//It takes the date of data and enddate= data.date.getDate()+1
					api.getSentimentForNameTimeframe({
						"character":data.character, "startDate":data.date,"endDate": new Date((new Date(data.date)).setDate(new Date(data.date).getDate()+1)).toISOString()
					},function(resp, err){
						if (err){
							done();
							throw err;
						}
						should.ok(resp);
						var respPosSum=0,
						respNegSum=0,
						respPosCount=0,
						respNegCount=0,
						respNullCount=0;
						for(var i=0;i<resp.length;i+=1){
							resp[i].character.should.be.equal(data.character);
							should.ok(resp[i].date);   								//Hard to test. Tests only if the date is present!
							respPosSum+=resp[i].posSum;
							respNegSum+=resp[i].negSum;
							respPosCount+=resp[i].posCount;
							respNegCount+=resp[i].negCount;
							respNullCount+=resp[i].nullCount;
						}
						respPosSum.should.be.aboveOrEqual(data.posSum);
						respNegSum.should.be.aboveOrEqual(data.negSum);
						respPosCount.should.be.aboveOrEqual(data.posCount);
						respNegCount.should.be.aboveOrEqual(data.negCount);
						respNullCount.should.be.aboveOrEqual(data.nullCount);
						done();
					});
					});
				};
				for (var i=0;i<dataArray.length;i+=1){
					loopfunction(dataArray[i]);
				}
			});
			describe.skip('name is not present',function (){
				it('should throw an SearchException',function(done){
					(function getSenForTime_NAME_ERROR(){
						api.getSentimentForNameTimeframe({
							"character": "Donald Trump", "startDate" : new Date(2016,2,16).toISOString(), "endDate": new Date(2016,2,16).toISOString()
					}, function(resp,err){
							if (err){
								done(); 
								throw err;
							}
							done();
							return resp;
						});
					}).should.throw("This is not a GoT-Character",{name:"SearchError",date:new Date(2016,2,16).toISOString(), character:'Donald Trump'});
				});
			});
			describe.skip('No Data exists for this date', function (){
				it ('should throw an SearchException',function (done){
					(function getSenForTime_NO_DATA(){
						api.getSentimentForNameTimeframe({"character":"Jon Snow","startDate": new Date(1990,1,1).toISOString(), "endDate": new Date(1990,1,4).toISOString()}, function(resp, err){
							if (err) {
								done(); 
								throw err;
							}
							return resp;
						});
					}).should.throw("For this date does no Twitterdata exist",{name:"SearchError",date:new Date(1990,1,1).toISOString(),character: 'Jon Snow'});
				});
			});
		});



		describe('Tops and Flops',function(){
			oneDateData = wholeDataArray.filter(function f (elem){
				var wish = new Date(dataArray[0].date);
				elem = new Date(elem.date);
				if (wish.getFullYear()!==elem.getFullYear()){
					return false;
				}
				if (wish.getMonth()!==elem.getMonth()){
					return false;
				}
				if (wish.getDate()!==elem.getDate()){
					return false;
				}
				return true;
			});
			var inputJSON = {
				"number":3,
				"startDate":oneDateData[0].date,
				"endDate":oneDateData[0].date
			},
			callback=function(arr,comProp,comparison){
				arr.length.should.equal(3);				//This fails as long as dummy data is used.
				for(var i=0; i<arr.length;i+=1){
					if(i!==0){
						comparison(arr[i][comProp],arr[i-1][comProp]).should.be.true();
					}
					arr[i].character.should.be.ok();
					arr[i].posSum.should.be.aboveOrEqual(0);
					arr[i].negSum.should.be.aboveOrEqual(0);
					arr[i].posCount.should.be.aboveOrEqual(0);
					arr[i].negCount.should.be.aboveOrEqual(0);
					arr[i].nullCount.should.be.aboveOrEqual(0);
					arr[i][comProp].should.be.equal(oneDateData[i][comProp]);
				
				}
			};
			describe('#topSentiment:',function(){
				oneDateData.sort(function(a,b){
					return b.posSum-a.posSum;
				});

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



			describe('#worstSentiment: ',function() {
				oneDateData.sort(function(a,b){
							return b.negSum-a.negSum;
				});
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


			
			describe('#mostTalkedAbout:',function(){
				oneDateData.sort(function(a,b){
					return (b.posCount+b.negCount+b.nullCount)-(a.posCount+b.negCount+b.nullCount);
				});
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
							(resp[i].posCount+resp[i].negCount+resp[i].nullCount).should.be.aboveOrEqual(oneDateData[i].posCount+oneDateData[i].negCount+oneDateData[i].nullCount);
						}
						done();
					});
				});
			});



			describe('#topControversial:',function(){
				it('The response-JSON meets its specification',function(done){
					api.topControversial(inputJSON,function(resp,err){
						oneDateData.sort(function(a,b){
							return (-b.negSum+b.posSum)-(-a.negSum+a.posSum);
						});
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
							(resp[i].posSum-resp[i].negSum).should.be.aboveOrEqual(oneDateData[i].posSum-oneDateData[i].negSum);
						}
						done();
					});
				});
			});
		});



		describe.skip('#sentimentPerEpisode:',function(){
			describe('Tests the DB-connection:',function(){
				it('It should throw as there can\'t be any data about an episode',function(done){
					(function sentPerEpisode(){
						api.sentimentPerEpisode({
							 	"character" : "Jon Snow",
							    "season" : 1,
							    "episode" : 1
						    },function(resp,err){if (err) {
						    	done();
						    	throw err;
						    }
						    done();
						    return resp;
						});
					}).should.throw('No results in database',{name:'SearchError', character: 'Jon Snow'});
				});
			});
		});



		describe('#runTwitterREST: ',function(){
			describe('Scrapes data from the last two days for Jon Snow:',function(){
				var date= new Date();
				date= new Date(date.getFullYear(),date.getMonth(), date.getDate()-2);
				it('Specified response-JSON gets checked:',function(done){
					api.runTwitterREST('Jon Snow', date.toISOString(), function(resp,err){
						if (err){
							done();
							throw err;
						}
						should.ok(resp);
						should.ok(resp.character);
						resp.character.should.be.equal('Jon Snow');
						should.ok(resp.date);
						resp.date.should.equal(date.toISOString());
						should.ok(resp.posSum);
						resp.posSum.should.be.aboveOrEqual(0);
						should.ok(resp.negSum);
						resp.negSum.should.be.aboveOrEqual(0);
						should.ok(resp.posCount);
						resp.posCount.should.be.aboveOrEqual(0);
						should.ok(resp.negCount);
						resp.negCount.should.be.aboveOrEqual(0);
						should.ok(resp.nullCount);
						resp.posCount.should.be.aboveOrEqual(0);
						done();
					});	
				});
			});
		});



		describe('#runTwitterStreaming',function() {
			this.timeout(32000);
			describe('Scrapes data for the next half minute for Jon Snow:',function(){
				it('Specified response-JSON gets checked:',function(done){
					api.runTwitterStreaming('Jon Snow', 30, function(resp,err){
						if (err){
							done();
							throw err;
						}
						should.ok(resp);
						should.ok(resp.character);
						resp.character.should.be.equal('Jon Snow');
						should.ok(resp.posSum);
						resp.posSum.should.be.aboveOrEqual(0);
						should.ok(resp.negSum);
						resp.negSum.should.be.aboveOrEqual(0);
						should.ok(resp.posCount);
						resp.posCount.should.be.aboveOrEqual(0);
						should.ok(resp.negCount);
						resp.negCount.should.be.aboveOrEqual(0);
						should.ok(resp.nullCount);
						resp.posCount.should.be.aboveOrEqual(0);
						done();
					});	
				});
			});
		});



	});

	run();

},6000);