//these are just references the instance of related lib so we can inject them to the controllers/services in an angular way.
angular.module('amplify', [])
  .factory('amplify', [ '$window',
    function ($window, $log) {
      if(typeof $window.amplify === void 0)
        $log.error('Failed to initialize amplify. Amplify undefined.');
      return $window.amplify;
    }
  ]);