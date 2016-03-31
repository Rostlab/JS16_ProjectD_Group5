module.exports=function (grunt){
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-mocha-cli');

	grunt.initConfig({
		jshint: {
			all: ['*.js', 'db/**/*.js','logic/**/*.js']
		},
		mochacli: {
			
			options:{
				require: ['should'],
				reporter: 'spec',
				delay: true
			},
			all: ['test/apiTest.js']
		}
	});

	
	grunt.registerTask('test',['jshint','mochacli']);

	grunt.registerTask('default',['jshint','mochacli']);

};