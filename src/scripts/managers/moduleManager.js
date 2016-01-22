//
// RETURNS LIST OF ENABLED/DISABLED MODULES IN THE SYSTEM
//
angular.module('af.moduleManager', ['_', 'af.appTenant', 'af.authManager'])

    .service('afModuleManager', function($q, $window, _, appTenant, afAuthManager) {

      var system_modules = [
        {
          key:'roadmap',
          enabled:appTenant.config('app.showRoadmap'),
          label:appTenant.config('label.moduleRoadmap')
        },
        {
          key:'assmt',
          enabled:appTenant.config('app.showAssmt'),
          label:appTenant.config('label.moduleAssmt')
        },
        {
          key:'metrics',
          enabled:appTenant.config('app.showSPAT'),
          label:appTenant.config('label.moduleSpat')
        },
        {
          key:'processpro',
          enabled:appTenant.config('app.showProcessPro'),
          label:appTenant.config('label.moduleProcessPro')
        },
        {
          key:'admin',
          enabled:true,
          label:'Admin'
        }
      ];


      var isAuthorized = function(module){
        if(module != 'admin') return true;
        return afAuthManager.isAdmin() ? true:false;
      };


      var afModuleManager;
      return afModuleManager = {

        // get list of enabled modules
        getEnabledModules:function(){
          return _.filter(system_modules, function(module){
            return module.enabled && isAuthorized(module);
          })
        },

        // checks if module is enabled.
        isEnabled:function(module){
          module = (''+module).toLowerCase();
          var enabledModules = afModuleManager.getEnabledModules();
          var enabledKeys = _.map(enabledModules, 'key');
          return _.includes(enabledKeys, module);
        },

        // attempts to redirect loggedInUser to a specific module
        redirectToModule:function(desiredModule){

          var defer = $q.defer();

          // whats available to user
          var availableModules = afModuleManager.getEnabledModules();
          if(availableModules.length == 0)
            return defer.reject(availableModules);

          // what do they want?
          if(!desiredModule) desiredModule = availableModules[0].key;
          desiredModule = (''+desiredModule).toLowerCase();

          if(afModuleManager.isEnabled(desiredModule)){
            //
            // VALID REDIRECT
            //
            var url = '/'+desiredModule+'/';
            switch(desiredModule){
              case 'portal':
              case 'roadmap':
              case 'assmt':
                $window.location = '/portal/login-redirection.php';
                return;
              case 'metrics':
                $window.location = '/metrics/#/login?from=auth&sessionToken='+afAuthManager.sessionToken();
                return;
              case 'admin':
                $window.location = '/admin/';
                return;
            }
            defer.resolve(desiredModule);
          } else {
            //
            // INVALID REDIRECT (return available modules)
            //
            defer.reject(availableModules);
          }
          return defer.promise;

        }


      }

    });