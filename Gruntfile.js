

module.exports = function(grunt) {

  var utils = require('./grunt/grunt_utils.js')(grunt);


  grunt.registerTask('default', ['concat:af-lib', 'copy', 'less']);
  grunt.registerTask('dev', ['default', 'watch']);

  // bower updaters
  grunt.registerTask('bower-update',  'updating dependencies', utils.bower.update());
  grunt.registerTask('bower-install', 'updating dependencies', utils.bower.install());


  grunt.initConfig({

    dirs:{
      js: {
        out: 'dist/js'
      },
      css:{
        in:'src/styles',
        out:'dist/css'
      }
    },

    // copy .html files (templates) into templates dir...
    copy:{
      templates:{
        files:[
          {
            expand: true,
            flatten: true,
            src: [
              'src/templates/**/*.html',
              'src/scripts/**/*.html'
            ],
            dest: 'dist/templates/',
            filter: 'isFile'
          }
        ]
      }
    },

    //
    // LESS
    //
    less:{
      'af-lib':{
        //options: {compress: true},
        files: {
          '<%= dirs.css.out %>/af-lib.css': '<%= dirs.css.in %>/af-lib/af-lib.less',
          '<%= dirs.css.out %>/af-init.css':'<%= dirs.css.in %>/af-lib/af-init.less'
        }
      },
      themes:{
        options: {compress: true},
        files: {
          '<%= dirs.css.out %>/theme-blue.css':      '<%= dirs.css.in %>/themes/theme-blue.less',
          '<%= dirs.css.out %>/theme-brown.css':     '<%= dirs.css.in %>/themes/theme-brown.less',
          '<%= dirs.css.out %>/theme-green.css':     '<%= dirs.css.in %>/themes/theme-green.less',
          '<%= dirs.css.out %>/theme-litegreen.css': '<%= dirs.css.in %>/themes/theme-litegreen.less',
          '<%= dirs.css.out %>/theme-orange.css':    '<%= dirs.css.in %>/themes/theme-orange.less',
          '<%= dirs.css.out %>/theme-red.css':       '<%= dirs.css.in %>/themes/theme-red.less'
        }
      }
    },

    
    //
    // SCRIPTS
    //
    concat: {


      //
      // AF-LIB
      //
      'af-lib': {
        options: {
          separator: grunt.util.linefeed + ';' + grunt.util.linefeed
        },
        nonull: true,
        files: {
          '<%= dirs.js.out %>/af-lib-core.js':[
            'src/scripts/**/*.js'
          ],
          '<%= dirs.js.out %>/af-lib-setup.js':[
            'src/setup/console-fix.js',
            'src/setup/**/*.js'
          ],
          '<%= dirs.js.out %>/af-lib-full.js':[
            'src/setup/console-fix.js',
            'src/setup/**/*.js',
            'src/scripts/**/*.js'
          ]
        }
      },


      //
      // AF-CORE
      //
      libs: utils.concat.files('<%= dirs.js.out %>/af-lib-vendor.js', [
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
      libsMin: utils.concat.files('<%= dirs.js.out %>/af-lib-vendor.min.js', [
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
        tasks: ['concat:af-lib']
      },
      themes: {
        files: ['src/styles/themes/**/*.less'],
        tasks: ['less:themes']
      },
      booty: {
        files: ['src/styles/af-lib/**/*.less', 'src/scripts/directives/**/*.less'],
        tasks: ['less:af-lib']
      },
      templates: {
        files: ['src/templates/**/*.html', 'src/scripts/**/*.html'],
        tasks: ['copy:templates']
      }
    }

  });



  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
};
