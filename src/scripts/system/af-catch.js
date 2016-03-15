angular.module('af.catch', [])
  .service('afCatch', function($window, $log) {
    if(typeof $window.afCatch === void 0)
      $log.error('Failed to initialize afCatch. afCatch undefined.');
    return $window.afCatch;
  });