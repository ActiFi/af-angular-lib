angular.module('af.amplify', [])
  .service('amplify', function($window) {
    return $window.amplify;
  });