angular.module('af.env', [])
  .service('afEnv', function($window, $log) {
    if(typeof $window.afEnv === void 0)
      $log.error('Failed to initialize afEnv. afEnv undefined.');
    return $window.afEnv;
  });