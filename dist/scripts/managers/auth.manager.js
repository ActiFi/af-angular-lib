
angular.module('af.authManager', ['af._', 'af.amplify', 'af.util'])

  .constant('AF_AUTH_MANAGER_CONFIG', {

    tokenPriority:['url', 'cache', 'window'],
    cacheFor:86400000, // 1 day

    cacheSessionTokenAs:'sessionToken',
    cacheWebTokenAs:'webToken',
    cacheUserAs:'loggedInUser'

  })

  .service('afAuthManager', function(AF_AUTH_MANAGER_CONFIG, $log, $util, amplify, $window) {

    var store = function(key, value){
      if(typeof amplify === void 0) $log.error('Failed to '+key+'. Amplify undefined.');
      amplify.store(key, value, { expires:AF_AUTH_MANAGER_CONFIG.cacheFor });
    };


    var getViaPriority  = function(key, priorities){
      priorities = priorities || AF_AUTH_MANAGER_CONFIG.tokenPriority;
      // cycle through possible locations..
      var value = null;
      _.each(priorities, function(priority) {
        if(value) return;
        switch (priority) {
          case 'url':     value = $util.GET(key); break;
          case 'cache':   value = amplify.store(key); break;
          case 'window':  value = $window[key]; break;
        }
      });
      return value;
    };


    var afAuthManager = {


      //
      // JSON WEB TOKEN
      //
      setWebToken:function(jwt){
        store(AF_AUTH_MANAGER_CONFIG.cacheWebTokenAs, jwt);
      },
      webToken:function(priorities){
        return getViaPriority(AF_AUTH_MANAGER_CONFIG.cacheWebTokenAs, priorities);
      },


      //
      // SESSION TOKEN (DEPRECATED)
      //
      setSessionToken:function(sessionToken){
        store(AF_AUTH_MANAGER_CONFIG.cacheSessionTokenAs, sessionToken);
      },
      sessionToken: function(priorities){
        return getViaPriority(AF_AUTH_MANAGER_CONFIG.cacheSessionTokenAs, priorities);
      },


      //
      // USER
      //
      setUser:function(user){
        store(AF_AUTH_MANAGER_CONFIG.cacheUserAs, user)
      },
      user:function(){
        return amplify.store(AF_AUTH_MANAGER_CONFIG.cacheUserAs);
      },
      userId:function(){
        var user = afAuthManager.user();
        if(user && user.userId) return user.userId;
        return null;
      },


      isLoggedIn:function(){
        return afAuthManager.user() && (afAuthManager.sessionToken() || afAuthManager.webToken())
      },

      // CLEAR / LOGOUT
      clear: function() {
        amplify.store(AF_AUTH_MANAGER_CONFIG.cacheSessionTokenAs, null);
        amplify.store(AF_AUTH_MANAGER_CONFIG.cacheWebTokenAs, null);
        amplify.store(AF_AUTH_MANAGER_CONFIG.cacheUserAs, null);
      }
    };

    // alias
    afAuthManager.logout = afAuthManager.clear;

    return afAuthManager;
});