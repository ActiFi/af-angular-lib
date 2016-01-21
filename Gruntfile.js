module.exports = function(grunt) {

  grunt.registerTask('default', ['concat']);
  grunt.registerTask('dev', ['concat', 'watch']);

  grunt.initConfig({

    less:{
      options: {compress: true},
      files: {
        'dist/afLib.css': 'src/assets/less/afLib.less',
        'dist/afInit.css':'src/assets/less/afInit.less'
      }
    },

    concat: {
      js: {
        options: {separator: grunt.util.linefeed + ';' + grunt.util.linefeed },
        files: {
          'dist/af-angular-lib.js':[
            'src/scripts/**/*'
          ],
          'dist/af-angular-setup.js':[
            'dist/setup/console-fix.js',
            'dist/setup/**/*'
          ]
        }
      }
    },

    watch: {
      js: {
        files: ['dist/scripts/**/*.js', 'dist/setup/**/*.js'],
        tasks: ['concat'],
        options: { livereload: true }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
