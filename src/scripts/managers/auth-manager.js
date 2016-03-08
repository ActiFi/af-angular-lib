
angular.module('af.authManager', ['_', 'amplify', 'af.util', 'af.appEnv', 'af.jwtManager'])


  // config
  .provider('afAuthManagerConfig', function(){
    this.tokenPriority = ['url', 'cache', 'window'];
    this.cacheFor = 86400000; // 1 day
    this.cacheSessionTokenAs = 'sessionToken';
    this.cacheJwtAs = 'jwt';
    this.cacheUserAs = 'loggedInUser';
    this.$get = function () { return this; };
  })

  .service('afAuthManager', function(afAuthManagerConfig, _, $log, afUtil, amplify, afJwtManager, $window) {

    var store = function(key, value, expires){
      expires = expires || afAuthManagerConfig.cacheFor;
      if(_.isNumber(expires))
        expires = {expires:expires};
      amplify.store(key, value, expires);
    };


    var getViaPriority  = function(key, priorities){
      priorities = priorities || afAuthManagerConfig.tokenPriority;
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


    var getSessionTokenFromJWT = function(priorities){
      var jwt = afAuthManager.jwt(priorities);
      if(!afAuthManager.jwt())
        return null;
      var decodedToken = afJwtManager.decode(jwt);
      if(decodedToken && decodedToken.sessionToken)
        return decodedToken.sessionToken;
      return null;
    };

    var afAuthManager = {

      //
      // JSON WEB TOKEN
      //
      setJWT:function(jwt){
        var decodedToken = afJwtManager.decode(jwt);
        if(!decodedToken)
          return $log.error('Could not setJWT. Invalid JWT');

        var timeTillExpires = afJwtManager.millisecondsTillExpires(decodedToken.exp);

        // cache both coded and decoded version till it expires
        store(afAuthManagerConfig.cacheJwtAs, jwt, timeTillExpires);
        // cache decoded as user...
        afAuthManager.setUser(decodedToken, timeTillExpires);

        if(appEnv.ENV() !== 'production')
          $log.info('afAuthManager - User Set:', afAuthManager.user());
        $log.info('afAuthManager - Session will expire:', afJwtManager.getExpiresOn(decodedToken.exp).format('YYYY-MM-DD HH:mm:ss'));
      },
      jwt:function(priorities){
        return getViaPriority(afAuthManagerConfig.cacheJwtAs, priorities);
      },

      //
      // SESSION TOKEN (DEPRECATED)
      //
      setSessionToken:function(sessionToken){
        store(afAuthManagerConfig.cacheSessionTokenAs, sessionToken);
      },
      sessionToken: function(priorities){
        var token = getViaPriority(afAuthManagerConfig.cacheSessionTokenAs, priorities);
        if(!token) token = getSessionTokenFromJWT(priorities);
        return token;
      },


      //
      // USER
      //
      setUser:function(user, expires){
        // put a "displayName" on the user
        user.displayName = afUtil.createDisplayName(user, appTenant.config('app.preferredDisplayName'));
        // cache user
        store(afAuthManagerConfig.cacheUserAs, user, expires);

        // support old apps
        store('userName',     user.displayName, expires); // this is not username.. its the persons name.. ffs.
        store('userId',       user.userId, expires);
        store('userEmail',    user.email, expires);
        store('authorities',  user.roles, expires);
        store('tenantId',     user.tenant, expires);
      },
      user:function(){
        return amplify.store(afAuthManagerConfig.cacheUserAs);
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
        return afAuthManager.user() && (afAuthManager.sessionToken() || afAuthManager.jwt())
      },
      // CLEAR / LOGOUT
      clear: function() {
        // just kill all cached data if logout
        _.keys(amplify.store(), function(key){
          amplify.store(key, null);
        });
      }
    };
    // alias
    afAuthManager.logout = afAuthManager.clear;

    return afAuthManager;
});