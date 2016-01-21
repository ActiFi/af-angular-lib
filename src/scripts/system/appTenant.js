angular.module('af.appTenant', ['af.appEnv'])

  .service('appTenant', function($window) {
    return $window.appTenant;
  })

  // include some filters
  .filter('appTenant',    function(appTenant) {  return appTenant.config;     })
  .filter('tenantConfig', function(appTenant) {  return appTenant.config;     }) // alias
  .filter('tenantLabel',  function(appTenant) {  return appTenant.label;      })
  .filter('plural',       function(appTenant) {  return appTenant.makePlural; })

  .filter('tenantImage', function(appEnv) {
    return function(file) {
      return '/tenant/' + appEnv.TENANT_HASH() + '/images/' + appEnv.TENANT_HASH() + '_' + file;
    };
  });