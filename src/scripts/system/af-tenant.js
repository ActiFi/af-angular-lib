angular.module('af.tenant', ['af.env'])

  .service('afTenant', function($window, $log) {
    if(typeof $window.afTenant === void 0)
      $log.error('Failed to initialize afTenant. afTenant undefined.');
    return $window.afTenant;
  })

  // include some filters
  .filter('afTenant',     function(afTenant) {  return afTenant.config;     })
  .filter('tenantConfig', function(afTenant) {  return afTenant.config;     }) // alias
  .filter('tenantLabel',  function(afTenant) {  return afTenant.label;      })
  .filter('plural',       function(afTenant) {  return afTenant.makePlural; })

  .filter('tenantImage', function(afEnv) {
    return function(file) {
      return '/tenant/' + afEnv.TENANT_HASH() + '/images/' + afEnv.TENANT_HASH() + '_' + file;
    };
  });