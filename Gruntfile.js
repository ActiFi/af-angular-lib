module.exports = function(grunt) {

  grunt.registerTask('default', ['concat', 'less', 'watch']);


  var angularVersion = '1.4.9';

  var concatLibs = function(filename, files){
    return {
      options: {
        separator: grunt.util.linefeed + ';' + grunt.util.linefeed
      },
      nonull: true,
      dest:'<%= dirs.js.out %>/'+filename,
      src: files
    }
  };

  grunt.initConfig({

    dirs:{
      version:angularVersion,
      js: {
        out: 'dist/scripts/<%= dirs.version %>'
      },
      css:{
        in:'src/styles',
        out:'dist/styles'
      }
    },

    // compile less
    less:{
      'af-lib':{
        //options: {compress: true},
        files: {
          '<%= dirs.css.out %>/af-lib.css': '<%= dirs.css.in %>/af-lib.less',
          '<%= dirs.css.out %>/af-init.css':'<%= dirs.css.in %>/af-init.less'
        }
      }
    },

    // compile js
    concat: {

      'af-lib': {
        options: {
          separator: grunt.util.linefeed + ';' + grunt.util.linefeed
        },
        nonull: true,
        files: {
          '<%= dirs.js.out %>/af-angular-lib-core.js':[
            'src/scripts/**/*'
          ],
          '<%= dirs.js.out %>/af-angular-lib-setup.js':[
            'src/setup/console-fix.js',
            'src/setup/**/*'
          ],
          '<%= dirs.js.out %>/af-angular-lib.js':[
            'src/setup/console-fix.js',
            'src/setup/**/*',
            'src/scripts/**/*'
          ]
        }
      },

      libs: concatLibs('af-core-libs.js', [
        // angular
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/amplify/lib/amplify.core.js',
        'bower_components/amplify/lib/amplify.store.js',
        // angular
        'bower_components/angular/angular.js',
        'bower_components/angular-sanitize/angular-sanitize.js',
        'bower_components/angular-animate/angular-animate.js',
        'bower_components/angular-messages/angular-messages.js',
        'bower_components/angular-ui-router/release/angular-ui-router.js',
        // util
        'bower_components/lodash/dist/lodash.js',
        'bower_components/moment/moment.js',
        // raven
        'bower_components/raven-js/dist/raven.min.js'
      ]),
      libsMin: concatLibs('af-core-libs.min.js', [
        // angular
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/amplify/lib/amplify.core.min.js',
        'bower_components/amplify/lib/amplify.store.min.js',
        // angular
        'bower_components/angular/angular.min.js',
        'bower_components/angular-sanitize/angular-sanitize.min.js',
        'bower_components/angular-animate/angular-animate.min.js',
        'bower_components/angular-messages/angular-messages.min.js',
        'bower_components/angular-ui-router/release/angular-ui-router.min.js',
        // util
        'bower_components/lodash/dist/lodash.min.js',
        'bower_components/moment/min/moment.min.js',
        // raven
        'bower_components/raven-js/dist/raven.min.js'
      ])
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
