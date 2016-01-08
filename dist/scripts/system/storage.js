//
// SIMPLE WRAPPER AROUND AMPLIFY.STORE TO ALLOW NAME SPACING...
//
angular.module('af.storage', [])

  .constant('$STORAGE_CONFIG', {persistent_prefix:'myApp'} )

  .service('$storage', function($STORAGE_CONFIG, $log) {

    var prefix = $STORAGE_CONFIG.persistent_prefix;

    // determine if data belons to this app
    var isAppData = function(key){
      return key.indexOf(prefix+'_') === 0;
    };

    var storage = null;
    return storage = {

      // amplify wrapper
      amplify:function(key, value, options){
        if(_.isNumber(options)) options = { expires:options };
        return amplify.store(prefix+'_'+key, value, options);
      },

      // STORE
      store:function(key, value, options){
        return storage.amplify(key, value, options);
      },

      // CLEAR
      clear: function(key) {
        if(key) {
          // clear one thing
          storage.amplify(key, null);
        } else {
          // clear all app data
          _.keys(amplify.store(), function(key){
            if(isAppData(key))
              amplify.store(key, null);
          });
        }
      },

      // NUKE
      // clear everything (all amplify data
      nuke:function(){
        _.keys(amplify.store(), function(key){
          amplify.store(key, null);
        });
      }

    };
  });

