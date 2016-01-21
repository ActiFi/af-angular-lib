//these are just references the instance of related lib so we can inject them to the controllers/services in an angular way.
angular.module('_', [])
  .factory('_', [ '$window',
    function ($window) { return $window._; }
  ]);