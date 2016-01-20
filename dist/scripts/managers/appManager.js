//
// RETURNS LIST OF ENABLED/DISABLED MODULES IN THE SYSTEM
//
angular.module('af.moduleManager', ['_', 'af.appTenant', 'af.authManager'])

    .service('afModuleManager', function(_, appTenant, afAuthManager) {

      var system_modules = [
        {
          key:'portal',
          enabled:true,
          label:appTenant.config('label.moduleRoadmap')
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
        getEnabledModules:function(){
          return _.filter(system_modules, function(module){
            return module.enabled && isAuthorized(module);
          })
        },
        isEnabled:function(module){
          var enabledModules = afModuleManager.getEnabledModules();
          var enabledKeys = _.map(enabledModules, 'key');
          return _.includes(enabledKeys, module);
        }
      }

    });