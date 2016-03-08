//these are just references the instance of related lib so we can inject them to the controllers/services in an angular way.
angular.module('moment', [])
  .factory('moment', [ '$window',
    function ($window, $log) {
      if(typeof $window.moment === void 0)
        $log.error('Failed to initialize moment. Moment undefined.');
      return $window.moment;
    }
  ]);