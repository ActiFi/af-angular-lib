//these are just references the instance of related lib so we can inject them to the controllers/services in an angular way.
angular.module('amplify', [])
  .factory('amplify', [ '$window',
    function ($window) { return $window.amplify; }
  ]);