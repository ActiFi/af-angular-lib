
angular.module('af.filters', ['af.appTenant'])


  // eg {{'user.name' | appTenant}}
  // <span ng-bind="'user' | tenantLabel | plural"></span>

  .filter('appTenant',    function(appTenant) {  return appTenant.config; })
  .filter('tenantConfig', function(appTenant) {  return appTenant.config; }) // alias
  .filter('tenantLabel',  function(appTenant) {  return appTenant.label; })
  .filter('plural',       function(appTenant) {  return appTenant.makePlural; })

  .filter('tenantImage', function(appTenant) {
    return function(file) {
      var tnt = appTenant.config('tenant');
      return '/tenant/' + tnt + '/images/' + tnt + '_' + file;
    };
  });