module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      options: {
        separator: ';'
      },

      dist: {
        src: [
          'parts/capsule/start.js',
          'parts/*.js',
          'parts/capsule/end.js'
          ],
        dest: 'gallerymenu.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('default', ['concat']);

};