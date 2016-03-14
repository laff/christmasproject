module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: '\n'
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

    watch: {

      js: {
        files: 'parts/capsule/*.js',
        tasks: ['concat']
      }

    }

  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'watch']);

};