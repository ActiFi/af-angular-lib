
module.exports = function(grunt) {

  var utils = null;
  return utils = {

    //
    // CONCAT
    //
    // e.g. concat: { app:utils.concat.files('app.js', ['file1.js', 'file2.js']) }
    concat:{
      files:function(destination, srcFiles, sourceMaps){
        return {
          options: {
            separator: grunt.util.linefeed + ';' + grunt.util.linefeed,
            sourceMap:sourceMaps
          },
          nonull: true,
          dest:destination,
          src: srcFiles
        }
      }
    },


    //
    // COPY
    //
    copy: {

      // Directory copy
      // e.g. copy:{ task : utils.copy.dir('bower_components/some_module/src', 'my/destination') }
      dir: function (from, to, src) {
        src = src || ['**/*'];
        return {
          nonull: true,
          expand: true,
          cwd: from,
          src: src,
          dest: to
        }
      }
    },

    cmd:function(command){
      return function() {
        console.log('running ' + command);
        var exec = require('child_process').exec;
        var cb = this.async();
        exec(command, {cwd: './'}, function(err, stdout, stderr) {
          console.log(stdout);
          cb();
        });
      }
    },
    bower:{
      update:function(app){
        var command = app ? 'bower update '+app : 'bower update';
        return utils.cmd(command);
      },
      install:function(){
        return function(app) {
          var command = app ? 'bower install '+app : 'bower install';
          return utils.cmd(command);
        }
      }
    }

  }

};