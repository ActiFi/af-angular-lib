//
// RETURNS LIST OF ENABLED/DISABLED MODULES IN THE SYSTEM
//
angular.module('af.moduleManager', ['_', 'af.appTenant', 'af.authManager'])

    .service('afModuleManager', function($q, $window, _, appTenant, afAuthManager) {

      var system_modules = [
        {
          key:'roadmap',
          enabled:appTenant.config('app.showRoadmap'),
          label:appTenant.config('label.moduleRoadmap'),
          canLogInto:true
        },
        {
          key:'assmt',
          enabled:appTenant.config('app.showAssmt'),
          label:appTenant.config('label.moduleAssmt'),
          canLogInto:false // requires transfer from another app
        },
        {
          key:'metrics',
          enabled:appTenant.config('app.showSPAT'),
          label:appTenant.config('label.moduleSpat'),
          canLogInto:true
        },
        {
          key:'processpro',
          enabled:appTenant.config('app.showProcessPro'),
          label:appTenant.config('label.moduleProcessPro'),
          canLogInto:true
        },
        {
          key:'admin',
          enabled:true,
          label:'Admin',
          canLogInto:true
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

        // list of modules that a user can directly login to
        getUserAccessibleModules:function(){
          return _.filter(afModuleManager.getEnabledModules(), function(module){
            return module.canLogInto;
          })
        },

        // if a user logs in... where do/can they login to?
        getDefaultModule:function(){
          var apps = afModuleManager.getUserAccessibleModules();
          if(!apps || !apps.length)
            return null;
          return apps[0]; // todo - make part of tenant config instead of just first app
        },

        // checks if module is enabled.
        isEnabled:function(module){
          module = (''+module).toLowerCase();
          var enabledModules = afModuleManager.getEnabledModules();
          var enabledKeys = _.map(enabledModules, 'key');
          return _.includes(enabledKeys, module);
        }

      }

    });