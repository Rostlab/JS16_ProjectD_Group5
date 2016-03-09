module.exports=function (grunt){
	grunt.initConfig({
		jshint: {
			all: ['*.js', 'db/**/*.js','logic/**/*.js']
		}
	});
	grunt.loadNpmTask('grunt-contrib-jshint');
	grunt.registerTask('test',['jshint']);

};