module.exports = function(grunt) {

  grunt.registerTask('default', ['less','concat']);
  grunt.registerTask('dev', ['default', 'watch']);

  grunt.initConfig({


    less:{
      'af-lib':{
        //options: {compress: true},
        files: {
          'dist/styles/af-lib.css': 'src/styles/af-lib.less',
          'dist/styles/af-init.css':'src/styles/af-init.less'
        }
      }
    },

    concat: {
      'af-lib': {
        options: {separator: grunt.util.linefeed + ';' + grunt.util.linefeed },
        files: {
          'dist/scripts/af-angular-lib-core.js':[
            'src/scripts/**/*'
          ],
          'dist/scripts/af-angular-lib-setup.js':[
            'src/setup/console-fix.js',
            'src/setup/**/*'
          ],
          'dist/scripts/af-angular-lib.js':[
            'src/setup/console-fix.js',
            'src/setup/**/*',
            'src/scripts/**/*'
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
