
angular.module('af.authManager', ['_', 'af.storage', 'af.util', 'af.env', 'af.jwtManager'])


  // config
  .provider('afAuthManagerConfig', function(){
    this.tokenPriority = ['url', 'cache', 'window'];
    this.cacheFor = 86400000; // 1 day
    this.cacheSessionTokenAs = 'sessionToken';
    this.cacheJwtAs = 'jwt';
    this.cacheUserAs = 'loggedInUser';
    this.$get = function () { return this; };
  })

  .service('afAuthManager', function(afAuthManagerConfig, _, $log, afUtil, afStorage, afJwtManager, $window) {

    var getViaPriority  = function(key, priorities){
      priorities = priorities || afAuthManagerConfig.tokenPriority;
      // cycle through possible locations..
      var value = null;
      _.each(priorities, function(priority) {
        if(value) return;
        switch (priority) {
          case 'url':     value = afUtil.location.search(key); break;
          case 'cache':   value = afStorage.store(key); break;
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

    var afAuthManager = null;
    return afAuthManager = {

      //
      // JSON WEB TOKEN
      //
      setJWT:function(jwt){
        var decodedToken = afJwtManager.decode(jwt);
        if(!decodedToken)
          return $log.error('Could not setJWT. Invalid JWT');

        var timeTillExpires = afJwtManager.millisecondsTillExpires(decodedToken.exp);

        //
        // CACHE TOKEN, USER & SESSIONTOKEN
        //
        // cache both coded and decoded version till it expires
        afStorage.store(afAuthManagerConfig.cacheJwtAs, jwt, timeTillExpires);

        // cache decoded as user...
        afAuthManager.setUser(decodedToken, timeTillExpires);
        // cache sessionToken as well if user contains one (like from a decoded jwt)
        afAuthManager.setSessionToken(decodedToken.sessionToken, timeTillExpires);

        if(afEnv.ENV() !== 'production')
          $log.info('afAuthManager - User Set:', afAuthManager.user());
        $log.info('afAuthManager - Session will expire:', afJwtManager.getExpiresOn(decodedToken.exp).format('YYYY-MM-DD HH:mm:ss'));
      },
      jwt:function(priorities){
        return getViaPriority(afAuthManagerConfig.cacheJwtAs, priorities);
      },

      //
      // SESSION TOKEN (DEPRECATED)
      //
      setSessionToken:function(sessionToken, expires){
        expires = !expires ? afAuthManagerConfig.cacheFor : expires;
        afStorage.store(afAuthManagerConfig.cacheSessionTokenAs, sessionToken, expires);
      },
      sessionToken: function(priorities){
        var token = getViaPriority(afAuthManagerConfig.cacheSessionTokenAs, priorities);
        if(!token) token = getSessionTokenFromJWT(priorities); // check in JWT if not found...
        return token;
      },


      //
      // USER
      //
      setUser:function(user, expires){
        // put a "displayName" on the user
        user.displayName = afUtil.format.createDisplayName(user, afTenant.config('app.preferredDisplayName'));
        // cache user
        afStorage.store(afAuthManagerConfig.cacheUserAs, user, expires);

        // support old apps
        afStorage.store('userName',     user.displayName, expires); // this is not username.. its the persons name.. ffs.
        afStorage.store('userId',       user.userId,      expires);
        afStorage.store('userEmail',    user.email,       expires);
        afStorage.store('authorities',  user.roles,       expires);
        afStorage.store('tenantId',     user.tenant,      expires);
      },
      user:function(){
        return afStorage.store(afAuthManagerConfig.cacheUserAs);
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

      // CLEAR / LOGOUT (clear all cached data)
      clear:afStorage.clear,
      logout:afStorage.clear // alias
    };
});