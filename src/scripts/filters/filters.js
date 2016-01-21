
angular.module('af.filters', ['af.appTenant'])

  // eg {{'user.name' | appTenant}}
  // <span ng-bind="'user' | tenantLabel | plural"></span>

  //
  //.filter('tenantImage', function(appTenant) {
  //  return function(file) {
  //    var tnt = appTenant.config('tenant');
  //    return '/tenant/' + tnt + '/images/' + tnt + '_' + file;
  //  };
  //});