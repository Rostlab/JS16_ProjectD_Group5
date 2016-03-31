setTimeout(function(){//This function is needed to get all the requires straighten up
	var should= require('should'),
	confjson = require ('../super_secret.json'),
	wholeDataArray = require ('../test/testData.json'),
	dataArray = [];
	api = require ('../main.js').init(confjson);
	for (var yps =0; Math.min(wholeDataArray.length,5)>yps; yps+=1){
		while(true){
			dataArray[yps] = wholeDataArray[Math.floor(Math.random()*(wholeDataArray.length))];
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
				

					var loopfunction = function(data){
							it('should return the specified JSON for '+data.character,function(done){
							var json = {"characterName":data.character, "date": data.date};
							api.getSentimentForName(json,function(resp,err){
								if (err) {
									done();
									throw err;
								}
								resp.characterName.should.be.equal(data.character);
								resp.date.should.be.equal(data.date);
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


			context('name is not present',function (){
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
			context('No Data exists for this date', function (){
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

		describe('#getSentimentForNameTimeframe: ',function(){
			context('Name is present:',function(){
				var loopfunction = function(data){
					it('Response-JSON checked for '+data.character, function(done){
						//It takes the date of data and enddate= data.date.getDate()+1
					api.getSentimentForName({
						"searchedName":data.characterName, "startDate":data.date,"endDate": new Date((new Date(data.date)).setDate(new Date(data.date).getDate()+1)).toISOString()
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
							resp[i].characterName.should.be.equal(data.character);
							resp[i].date.should.be.equal(new Date(data.date).setDate(new Date(data.date).getDate()+i).toISOString());
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
			context('name is not present',function (){
				it('should throw an SearchException',function(done){
					(function (){
						api.getSentimentForNameTimeframe({
							"characterName": "Donald Trump", "startDate" : new Date(2016,2,16).toISOString(), "endDate": new Date(2016,2,16).toISOString()
					}, function(resp,err){
							if (err){
								done(); 
								throw err;
							}
							done();
							return resp;
						});
					}).should.throw("This is not a GoT-Character",{name:"SearchError",date:new Date(2016,2,16).toISOString(), searchedName:'Donald Trump'});
				});
			});
			context('No Data exists for this date', function (){
				it ('should throw an SearchException',function (done){
					(function (){
						api.getSentimentForName({"searchedName":"Jon Snow","startDate": new Date(1990,1,1).toISOString(), "endDate": new Date(1990,1,4).toISOString()}, function(resp, err){
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
			var oneDateData = wholeDataArray.filter(function f (elem){
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
					arr[i].name.should.be.ok();
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
					api.mostTalkedAbout(inputJSON,function(resp,err){
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



		describe('#sentimentPerEpisode:',function(){
			context('Tests the DB-connection:',function(){
				it('It should throw as there can\'t be any data about an episode',function(done){
					(function(){
						api.sentimentPerEpisode({
							 	"name" : "Jon Snow",
							    "season" : 1,
							    "episode" : 1
						    },function(resp,err){if (err) {
						    	done();
						    	throw err;
						    }
						    done();
						    return resp;
						});
					})
					.should.throw('No results in database',{name:'SearchError', characterName: 'Jon Snow'});
				});
			});
		});



		describe('#runTwitterREST: ',function(){
			describe('Scrapes data from the last two days for Jon Snow:',function(){
				var date= new Date();
				date= new Date(date.getFullYear(),date.getMonth(), date.getDate()-2);
				it('Specified response-JSON gets checked:',function(done){
					api.runTwitterREST('Jon Snow', date, function(resp,err){
						if (err){
							done();
							throw err;
						}
						should.ok(resp);
						should.ok(resp.characterName);
						resp.characterName.should.be.equal('Jon Snow');
						should.ok(resp.date);
						resp.date.should.equal(date);
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



		describe('#runStreamingAPI',function() {
			this.timeout(32000);
			describe('Scrapes data for the next half minute for Jon Snow:',function(){
				it('Specified response-JSON gets checked:',function(done){
					api.runTwitterREST('Jon Snow', 30, function(resp,err){
						if (err){
							done();
							throw err;
						}
						should.ok(resp);
						should.ok(resp.characterName);
						resp.characterName.should.be.equal('Jon Snow');
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