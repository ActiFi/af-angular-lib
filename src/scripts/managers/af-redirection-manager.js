//
// RETURNS LIST OF ENABLED/DISABLED MODULES IN THE SYSTEM
//
angular.module('af.redirectionManager', ['_', 'af.util', 'af.storage', 'af.appCatch', 'af.moduleManager', 'af.appEnv', 'af.appTenant', 'af.authManager'])

    .service('afRedirectionManager', function($q, $log, $window, $location, $httpParamSerializer, afUtil, appEnv, afStorage, appCatch, _, afModuleManager, appTenant, afAuthManager) {

      var go = function(to, replace){
        // get replace value
        replace = _.isBoolean(replace) ? replace:true;
        if(replace)
          $window.location.replace(to); // no history state...
        else
          $window.location.href = to;
      };


      var missingParams = function(params, requiredParams){
        var missingParams = [];
        _.each(requiredParams, function(requiredParam){
          if(!_.has(params, requiredParam))
            missingParams.push(requiredParam);
        });
        if(missingParams.length)
          return missingParams.join(',');
        return false
      };

      var getQueryString = function(params, paramsToAdd){
        var params = _.extend({ from:appEnv.APP() }, paramsToAdd, params);
        // return nothing if params is empty...
        return _.keys(params).length ? '?'+$httpParamSerializer(params):'';
      };

      var loggedIn = function(redirect){
        if(!afAuthManager.isLoggedIn()){
          appCatch.send('afRedirectManager: ' + redirect + ' redirect attempted, but user was not logged in.');
          afRedirectionManager.redirect('auth', {redirect:redirect || ''});
          return false;
        }
        return true;
      };





      var afRedirectionManager;
      return afRedirectionManager = {

        //
        // MAIN REDIRECT FUNCTIONS
        //
        redirect:function(redirectKey, params, replace){

          redirectKey = (''+redirectKey).toLowerCase();

          switch(redirectKey) {
            //
            // AUTH
            case 'auth':
              // eg.  /auth/#/login?redirect=portal&action=invalidsesssion
              var queryString = getQueryString(params);
              go('/auth/#/login'+queryString, true);
              return;

            //
            // PORTAL -> standard login
            case 'roadmap':
              // page that has code to mimic portals login page.
              if(!loggedIn(redirectKey)) return; // ensure logged in
              go('/portal/login-window.php', replace);
              return;


            // METRICS
            // eg. /metrics/#/login?from=auth&sessionToken=abc123
            case 'metrics':
              if(!loggedIn(redirectKey)) return; // ensure logged in
              var queryString = getQueryString(params, { sessionToken: afAuthManager.sessionToken() });
              go('/metrics/#/login'+queryString, replace); // page that has code that mimics portals login page.
              return;

            //
            // PROCESSPRO
            case 'processpro':
              if(!loggedIn(redirectKey)) return; // ensure logged in
              go('/processpro/', replace); // page that has code that mimics portals login page.
              return;

            //
            // ADMIN
            case 'admin':
              if(!loggedIn(redirectKey)) return; // ensure logged in
              go('/admin/', replace); // page that has code that mimics portals login page.
              return;

            //
            // ROADMAP EMAIL ROADMAP UPDATER
            case 'rmupdater':
              var missing = missingParams(params, 'dateFrom');
              if(missing) {
                appCatch('Redirection to ' + redirectKey + ' failed. Missing Params. [' + missing + '] not found.');
                return false;
              }
              go('/act/updater/#/rm/updater?dateFrom='+params.dateFrom, replace);
              return;

            default:
              appCatch('Redirection ['+redirectKey+'] not found.');
          }
          return false;
        },

        // attempts to redirect user to another actifi app(module)
        changeApp:function(desiredModule){

          // whats available to user
          var availableModules = afModuleManager.getUserAccessibleModules();
          if(availableModules.length == 0)
            return $q.reject([]);

          // if no specific app defined, log them into first userAccessible app
          if (!desiredModule) {
            var defaultModule = afModuleManager.getDefaultModule();
            if(!defaultModule)
              return $q.reject([]);
            desiredModule = defaultModule.key;
          }

          // ensure lowercase
          desiredModule = ('' + desiredModule).toLowerCase();

          // Make sure they can actually log into the desired module
          var isAvailable = _.find(availableModules, {key:desiredModule});
          if(!isAvailable)
            return $q.reject(availableModules);

          // actually do the redirect...
          if(afRedirectionManager.redirect(desiredModule) === false){
            $log.error(reason);
            return $q.reject(availableModules);
          }
        },


        // redirect to auth because of session issues...
        loggedOut:function(options){
          options = options || {};
          options.action = 'logout';
          afRedirectionManager.redirect('auth', options);
        },
        invalidSession:function(options){
          options = options || {};
          options.action = 'invalidsession';
          afRedirectionManager.redirect('auth', options);
        }

      }

    });