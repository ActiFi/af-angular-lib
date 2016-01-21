var _ = require('lodash');

module.exports = function gruntExport(grunt) {

  // grunt less                                     (compile everything)
  // grunt less:themes --theme=blue                 (compile just blue theme)
  // grunt less:themes --theme=blue --version=3.3.6 (compile just blue 3.3.6 theme)


  // compile what?
  var theme = grunt.option('theme') || null;               // null = all
  var themeVersion = grunt.option('themeVersion') || null; // null = all

  var themes = [
    'blue',
    'brown',
    'green',
    'litegreen',
    'orange',
    'red'
  ];

  var themeVersions = [
    '3.3.6'
  ];

  var gruntConfig = {
    less: {
      tenant: {
        files: {
          // 'actifi/css/actifi_styles.css':'actifi/actifi_styles.less'
        }
      },
      themes: {
        options: {compress: true},
        files: {
          // 'assets/styles/themes/3.3.6/theme-blue.3.3.6.css': 'assets/styles/themes/3.3.6/theme-blue.3.3.6.less'
        }
      },
      // this is old but will still compile a new tenant if necessary...
      legacy: {
        options: {compress: true},
        files: {
          // 2.0.3
          //'<%= tenant %>/css/<%= tenant %>_bootstrap.2.0.3.css':  '_less/2.0.3/theme/<%= tenant %>_bootstrap.2.0.3.less',
          //'<%= tenant %>/css/<%= tenant %>_appLayout.2.0.3.css':  '_less/2.0.3/theme/<%= tenant %>_appLayout.2.0.3.less'
        }
      }
    }
  };


  // TENANT COLORS:
  // format : 'actifi/css/actifi_styles.css':'actifi/actifi_styles.less'
  var tenantsToCompile = tenant ? [tenant]:tenants;
  _.each(tenantsToCompile, function(tnt){
    gruntConfig.less.tenant.files[tnt+'/css/'+tnt+'_styles.css'] = tnt+'/'+tnt+'_styles.less'
  });

  var input = null;
  var output = null;
  // THEMES:
  // format : 'assets/styles/themes/3.3.6/css/theme-blue.3.3.6.css': 'assets/styles/themes/3.3.6/theme-blue.3.3.6.less'
  // format : 'assets/styles/themes/3.3.6/css/theme-blue.3.3.6.css': '_styles/themes/3.3.6/theme-blue.3.3.6.less'
  var versionToCompile = themeVersion ? [themeVersion]:themeVersions;
  var themesToCompile = theme ? [theme]:themes;
  _.each(versionToCompile, function(version){
    _.each(themesToCompile, function(theTheme){
      input =  '_styles/themes/'+version+'/theme-'+theTheme+'.'+version+'.less';
      output = 'assets/styles/themes/'+version+'/css/theme-'+theTheme+'.'+version+'.css';
      gruntConfig.less.themes.files[output] = input;
    });
  });

  // LEGACY THEME:
  // format : '<%= tenant %>/css/<%= tenant %>_bootstrap.2.0.3.css':  '_legacy/_less/2.0.3/theme/<%= tenant %>_bootstrap.2.0.3.less',
  // format : '<%= tenant %>/css/<%= tenant %>_appLayout.2.0.3.css':  '_legacy/_less/2.0.3/theme/<%= tenant %>_appLayout.2.0.3.less',
  var versionToCompile = ['2.0.3', '2.3.1'];
  _.each(versionToCompile, function(version){
    _.each(tenants, function(tnt){
      // _bootstrap
      input =  '_legacy/_less/'+version+'/themes/'+tnt+'_bootstrap.'+version+'.less';
      output = tnt+'/css/'+tnt+'_bootstrap.'+version+'.css';
      gruntConfig.less.legacy.files[output] = input;
      // _appLayout
      input =  '_legacy/_less/'+version+'/themes/'+tnt+'_appLayout.'+version+'.less';
      output = tnt+'/css/'+tnt+'_appLayout.'+version+'.css';
      gruntConfig.less.legacy.files[output] = input;
    });
  });


  grunt.config.merge(gruntConfig);
  grunt.loadNpmTasks('grunt-contrib-less');
};