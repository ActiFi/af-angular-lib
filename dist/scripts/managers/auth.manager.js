
angular.module('af.authManager', ['_', 'amplify', 'af.util', 'af.appEnv', 'af.jwtManager'])

  .constant('AF_AUTH_MANAGER_CONFIG', {

    tokenPriority:['url', 'cache', 'window'],
    cacheFor:86400000, // 1 day

    cacheSessionTokenAs:'sessionToken',
    cacheWebTokenAs:'webToken',
    cacheUserAs:'loggedInUser'

  })

  .service('afAuthManager', function(AF_AUTH_MANAGER_CONFIG, $log, afUtil, amplify, afJwtManager, $window) {

    var store = function(key, value, expires){
      expires = expires || AF_AUTH_MANAGER_CONFIG.cacheFor;
      if(_.isNumber(expires))
        expires = {expires:expires};

      if(typeof amplify === void 0) $log.error('Failed to '+key+'. Amplify undefined.');
      amplify.store(key, value, expires);
    };


    var getViaPriority  = function(key, priorities){
      priorities = priorities || AF_AUTH_MANAGER_CONFIG.tokenPriority;
      // cycle through possible locations..
      var value = null;
      _.each(priorities, function(priority) {
        if(value) return;
        switch (priority) {
          case 'url':     value = afUtil.GET(key); break;
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
        var decodedToken = afJwtManager.decode(jwt);
        var timeTillExpires = afJwtManager.millisecondsTillExpires(decodedToken.exp);

        // cache both coded and decoded version till it expires
        store(AF_AUTH_MANAGER_CONFIG.cacheWebTokenAs, jwt, timeTillExpires);
        // cache decoded as user...
        afAuthManager.setUser(decodedToken, timeTillExpires);

        if(appEnv.ENV() !== 'production')
          $log.info('afAuthManager - User Set:', afAuthManager.user());
        $log.info('afAuthManager - Session will expire:', afJwtManager.getExpiresOn(decodedToken.exp).format('YYYY-MM-DD HH:mm:ss'));
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
      setUser:function(user, expires){
        // put a "displayName" on the user
        user.displayName = afUtil.createDisplayName(user, appTenant.config('app.preferredDisplayName'));
        // cache user
        store(AF_AUTH_MANAGER_CONFIG.cacheUserAs, user, expires);

        // support old apps
        store('userName',     user.displayName, expires); // this is not username.. its the persons name.. ffs.
        store('userId',       user.userId, expires);
        store('userEmail',    user.email, expires);
        store('authorities',  user.authorities, expires);
        store('tenantId',     user.tenant, expires);
      },
      user:function(){
        return amplify.store(AF_AUTH_MANAGER_CONFIG.cacheUserAs);
      },
      userId:function(){
        var user = afAuthManager.user();
        if(user && user.userId) return user.userId;
        return null;
      },



      //
      // MISC
      //
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