angular.module('af.appTenant', [])
  .service('appTenant', function($window) {
    return $window.appTenant;
  });