angular.module('af.track', [])
  .service('afTrack', function($window, $log) {
    if(typeof $window.afTrack === void 0)
      $log.error('Failed to initialize afTrack. afTrack undefined.');
    return $window.afTrack;
  });