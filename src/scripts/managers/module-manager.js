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
          showInDropDown:true
        },
        {
          key:'assmt',
          inDropDown:false,
          enabled:appTenant.config('app.showAssmt'),
          label:appTenant.config('label.moduleAssmt'),
          showInDropDown:false
        },
        {
          key:'metrics',
          enabled:appTenant.config('app.showSPAT'),
          label:appTenant.config('label.moduleSpat'),
          showInDropDown:true
        },
        {
          key:'processpro',
          enabled:appTenant.config('app.showProcessPro'),
          label:appTenant.config('label.moduleProcessPro'),
          showInDropDown:true
        },
        {
          key:'admin',
          enabled:true,
          label:'Admin',
          showInDropDown:true
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

        getModulesForDropDown:function(){
          return _.filter(afModuleManager.getEnabledModules(), function(module){
            return module.showInDropDown;
          })
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