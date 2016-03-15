var should = require ('should');
var defaultTestFun=function (){
	return 1
};
describe('defaultTestFun()', function(){
	it('should return 1', function (){
		defaultTestFun().should.equal(1);
	});
});