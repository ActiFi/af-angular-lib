//these are just references the instance of related lib so we can inject them to the controllers/services in an angular way.
angular.module('_', [])
  .factory('_', [ '$window',
    function ($window, $log) {
      if(typeof $window._ === void 0)
        $log.error('Failed to initialize lodash. lodash undefined.');
      return $window._;
    }
  ]);