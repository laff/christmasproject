module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),



		concat: {
			options: {
				separator: '\n\n\n'
			},

			dist: {
				src: [
					'parts/capsule/start.js',
					'parts/*.js',
					'parts/capsule/end.js'
				],
					dest: 'gallerymenu.js'
				}
			},

			uglify: {
				build: {
					src: 'gallerymenu.js',
					dest: 'gallerymenu.min.js'
				}
			},

			watch: {
				js: {
					files: ['parts/capsule/*.js','parts/*.js'],
					tasks: ['concat']
				}
			}
		});

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['concat', 'watch', 'uglify']);

};