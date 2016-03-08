//these are just references the instance of related lib so we can inject them to the controllers/services in an angular way.
angular.module('$', [])
  .factory('$', [ '$window',
    function ($window, $log) {
      if(typeof $window.jQuery === void 0)
        $log.error('Failed to initialize $. jQuery undefined.');
      return $window.jQuery; }
  ]);