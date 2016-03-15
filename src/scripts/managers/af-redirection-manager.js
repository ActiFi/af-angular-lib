//
// RETURNS LIST OF ENABLED/DISABLED MODULES IN THE SYSTEM
//
angular.module('af.redirectionManager', ['_', 'af.util', 'af.storage', 'af.catch', 'af.moduleManager', 'af.env', 'af.tenant', 'af.authManager'])

    .service('afRedirectionManager', function($q, $log, $window, $location, $httpParamSerializer, afUtil, afEnv, afStorage, afCatch, _, afModuleManager, afTenant, afAuthManager) {

      var go = function(url, options){
        options = options || {}; // { body, replace, newWindow }
        if(options.replace)
          $window.location.replace(url); // no history state...
        if(options.newWindow)
          afUtil.postToUrl(url, options.body, true); // new window...
        else
          $window.location.href = url;
      };

      var missingParams = function(searchParams, requiredParams){
        var missingParams = [];
        _.each(requiredParams, function(requiredParam){
          if(!_.has(searchParams, requiredParam))
            missingParams.push(requiredParam);
        });
        if(missingParams.length)
          return missingParams.join(',');
        return false
      };

      var convertToHttpParams = function(searchParams, searchParamsToAdd){
        var searchParams = _.extend({ from:afEnv.APP() }, searchParamsToAdd, searchParams);
        // return nothing if searchParams is empty...
        return _.keys(searchParams).length ? '?'+$httpParamSerializer(searchParams):'';
      };



      var afRedirectionManager;
      return afRedirectionManager = {

        //
        // MAIN REDIRECT FUNCTIONS
        //
        redirect:function(redirectKey, searchParams, options) {
          var defer = $q.defer();
          redirectKey = ('' + redirectKey).toLowerCase();


          // PUBLIC REDIRECTS
          if(redirectKey == 'auth'){
            var queryString = convertToHttpParams(searchParams);
            go('/auth/#/login'+queryString, options);


          // MUST BE LOGGED IN....
          } else if(!afAuthManager.isLoggedIn()) {

            // whoops.. need to be logged in...
            var error = 'Invalid Session. Redirect to '+redirectKey+' failed.';
            afCatch.send(error);
            // send them to login page....
            afRedirectionManager.invalidSession({ redirect:redirectKey || '' });

          } else {

            switch(redirectKey) {

              //
              // PORTAL -> standard login
              case 'roadmap':
                var queryString = convertToHttpParams(searchParams);
                go('/portal/login-window.php#/'+queryString, options);
                break;

              // METRICS
              // eg. /metrics/#/login?from=auth&sessionToken=abc123
              case 'metrics':
                var queryString = convertToHttpParams(searchParams, { sessionToken: afAuthManager.sessionToken() });
                go('/metrics/#/login'+queryString, options); // page that has code that mimics portals login page.
                break;

              //
              // PROCESS PRO
              case 'processpro':
                var queryString = convertToHttpParams(searchParams);
                go('/processpro/#/'+queryString, options); // page that has code that mimics portals login page.
                break;

              //
              // ADMIN
              case 'admin':
                var queryString = convertToHttpParams(searchParams);
                go('/admin/#/'+queryString, options); // page that has code that mimics portals login page.
                break;

              //
              // ROADMAP EMAIL ROADMAP UPDATER
              case 'rmupdater':
                var missing = missingParams(searchParams, ['dateFrom']);
                if(missing) {
                  defer.reject('Redirection ['+redirectKey+'] not found.');
                } else {
                  var queryString = convertToHttpParams({ dateFrom: searchParams.dateFrom });
                  go('/act/rmupdater/#/rm/updater'+queryString, options);
                }
                break;

              default:
                afCatch.send('Redirection ['+redirectKey+'] not found.');
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
        logout:function(searchParams, options){
          searchParams = searchParams || {};
          searchParams.action = 'logout';
          afRedirectionManager.redirect('auth', searchParams, options);
        },
        invalidSession:function(searchParams, options){
          searchParams = searchParams || {};
          searchParams.action = 'invalidsession';
          afRedirectionManager.redirect('auth', searchParams, options);
        },


        roadmap:{
          openRoadmapPage:function(page, hash, hui, searchParams, options){
            var defaults = { page:page };
            if(_.isString(hash)) defaults.hash = hash;
            if(_.isBoolean(hui)) defaults.hui = hui;
            searchParams = _.extend({}, defaults, searchParams);
            return afRedirectionManager.redirect('roadmap', searchParams, options);
          },
          editRoadmap:function(roadmapId, userId, hui, searchParams, options){
            searchParams = searchParams || {};
            searchParams.userId = userId;
            return afRedirectionManager.roadmap.openRoadmapPage('user-roadmaps', 'roadmapsEdit/'+roadmapId, hui, searchParams, options);
          }
        }

      }

    });