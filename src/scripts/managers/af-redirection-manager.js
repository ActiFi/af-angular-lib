//
// RETURNS LIST OF ENABLED/DISABLED MODULES IN THE SYSTEM
//
angular.module('af.redirectionManager', ['_', 'af.appCatch', 'af.moduleManager', 'af.appTenant', 'af.authManager'])

    .service('afRedirectionManager', function($q, $log, $window, $location, $httpParamSerializer, appCatch, _, afModuleManager, appTenant, afAuthManager) {

      var go = function(to, replace){
        // get replace value
        replace = _.isBoolean(replace) ? replace:true;
        if(replace)
          $window.location.replace(to); // no history state...
        else
          $window.location.href = to;
      };

      var validateParams = function(params, requiredParams){
        var missingParams = [];
        _.each(requiredParams, function(requiredParam){
          if(!_.has(params, requiredParam))
            missingParams.push(requiredParam);
        });
        if(missingParams.length)
          return $q.reject(missingParams.join(','));
        return $q.success('success');
      };

      var getQueryString = function(params, paramsToAdd){
        var params = _.extend({}, params, paramsToAdd);
        // return nothing if params is empty...
        return _.keys(params).length ? '?'+$httpParamSerializer(params):'';
      };

      var sessionCheck = function(redirect){
        if(!afAuthManager.isLoggedIn()){
          appCatch.send('afRedirectManager: ' + redirect + ' redirect attempted, but user was not logged in.');
          go('/auth/#/login', { action:'invalidsession', redirect:redirect || '' });
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

          switch(redirectKey){

            //
            // PORTAL
            case 'portal':
              if(!sessionCheck(redirectKey)) return;   // ensure logged in
              go('/portal/login-window.php', replace); // page that has code to mimic portals login page.
              return $q.when('success');

            // METRICS
            // eg. /metrics/#/login?from=auth&sessionToken=abc123
            case 'metrics':
              if(!sessionCheck(redirectKey)) return $q.reject('Invalid Session'); // ensure logged in
              var queryString = getQueryString(params, { sessionToken:afAuthManager.sessionToken() });
              go('/metrics/#/login'+queryString, replace); // page that has code that mimics portals login page.
              return $q.when('success');

            //
            // PROCESSPRO
            case 'processpro':
              if(!sessionCheck(redirectKey)) return $q.reject('Invalid Session'); // ensure logged in
              go('/processpro', replace); // page that has code that mimics portals login page.
              return $q.when('success');

            //
            // ADMIN
            case 'admin':
              if(!sessionCheck(redirectKey)) return $q.reject('Invalid Session'); // ensure logged in
              go('/admin', replace); // page that has code that mimics portals login page.
              return $q.when('success');

            // EMAIL roadmap rec updater
            case 'rmupdater':
              return validateParams(params, 'dateFrom')
                .then(function(response){
                  go('/act/updater/#/rm/updater?dateFrom='+params.dateFrom, replace);
                });

            default:
              return $q.reject('Redirection ['+redirectKey+'] not found.')
          }
        },


        // attempts to redirect user to another actifi app(module)
        changeApp:function(desiredModule, options){
          // whats available to user
          var availableModules = afModuleManager.getEnabledModules();
          if(availableModules.length == 0)
            return $q.reject(availableModules);

          // if no specific app defined, log them into first userAccessible app
          if (!desiredModule) {
            var defaultModule = afModuleManager.getDefaultModule();
            if(!defaultModule)
              return $q.reject('Unable to redirect. No available redirects.');
            desiredModule = defaultModule.key;
          }

          // ensure lowercase
          desiredModule = ('' + desiredModule).toLowerCase();

          if(!afModuleManager.isEnabled(desiredModule))
            return $q.reject(availableModules);

          // actually do the redirect...
          return afRedirectionManager.redirect(desiredModule, options)
            .catch(function(reason){
              // if it fails:
              $log.error(reason);
              return $q.reject(availableModules);
            })

        }

      }

    });