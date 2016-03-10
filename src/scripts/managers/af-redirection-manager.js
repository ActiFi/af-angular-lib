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

      var redirectError = function(redirectKey, msg){
        msg = 'afRedirectManager.redirect Error: ' + redirectKey + ': ' + msg;

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

      var convertToHttpParams = function(params, paramsToAdd){
        var params = _.extend({ from:appEnv.APP() }, paramsToAdd, params);
        // return nothing if params is empty...
        return _.keys(params).length ? '?'+$httpParamSerializer(params):'';
      };



      var afRedirectionManager;
      return afRedirectionManager = {

        //
        // MAIN REDIRECT FUNCTIONS
        //
        redirect:function(redirectKey, params, replace) {
          var defer = $q.defer();
          redirectKey = ('' + redirectKey).toLowerCase();


          // PUBLIC REDIRECTS
          if(redirectKey == 'auth'){

            var queryString = convertToHttpParams(params);
            go('/auth/#/login'+queryString, true);


          // MUST BE LOGGED IN....
          } else if(!afAuthManager.isLoggedIn()) {

            // whoops.. need to be logged in...
            var error = 'afRedirectManager.redirect to '+redirectKey+' attempted, but user was not logged in.';
            appCatch.send(error);
            // send them to auth....
            afRedirectionManager.invalidSession({redirect:redirectKey || ''});

          } else {

            switch(redirectKey) {

              //
              // PORTAL -> standard login
              case 'roadmap':
                // page that has code to mimic portals login page.
                go('/portal/login-window.php', replace);
                break;

              // METRICS
              // eg. /metrics/#/login?from=auth&sessionToken=abc123
              case 'metrics':
                // TODO: need to allow metrics to accept jwt
                var queryString = convertToHttpParams(params, { sessionToken: afAuthManager.sessionToken() });
                go('/metrics/#/login'+queryString, replace); // page that has code that mimics portals login page.
                break;

              //
              // PROCESS PRO
              case 'processpro':
                go('/processpro/', replace); // page that has code that mimics portals login page.
                break;

              //
              // ADMIN
              case 'admin':
                go('/admin/', replace); // page that has code that mimics portals login page.
                break;

              //
              // ROADMAP EMAIL ROADMAP UPDATER
              case 'rmupdater':
                var missing = missingParams(params, ['dateFrom']);
                if(missing) {
                  defer.reject('Redirection ['+redirectKey+'] not found.');
                } else {
                  go('/act/rmupdater/#/rm/updater?dateFrom='+params.dateFrom, replace);
                }
                break;

              default:
                appCatch('Redirection ['+redirectKey+'] not found.');
                defer.reject('Redirection ['+redirectKey+'] not found.');
            }

          }
          return defer.promise;
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
          return afRedirectionManager.redirect(desiredModule)
            .catch(function(reason){
              return $q.reject(availableModules);
            });
        },


        // redirect to auth because of session issues...
        logout:function(options){
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