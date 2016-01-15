angular.module('af.moment', [])
  .service('moment', function($window) {
    return $window.moment;
  });