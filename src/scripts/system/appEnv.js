angular.module('af.appEnv', [])
  .service('appEnv', function($window) {
    return $window.appEnv;
  });