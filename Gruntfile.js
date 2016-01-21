module.exports = function(grunt) {

  grunt.registerTask('default', ['concat', 'less', 'watch']);

  grunt.initConfig({


    // compile less
    less:{
      'af-lib':{
        //options: {compress: true},
        files: {
          'dist/styles/af-lib.css': 'src/styles/af-lib.less',
          'dist/styles/af-init.css':'src/styles/af-init.less'
        }
      }
    },

    // compile js
    concat: {
      'af-lib': {
        options: {
          separator: grunt.util.linefeed + ';' + grunt.util.linefeed
          //sourceMap:true
        },
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

    // watch files... (for dev)
    watch: {
      options: { livereload: false },
      js: {
        files: ['src/scripts/**/*.js', 'src/setup/**/*.js'],
        tasks: ['concat']
      },
      styles: {
        files: ['src/styles/**/*.less'],
        tasks: ['less']
      }
    }

  });



  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
