
angular.module('af.validators', [])
    
  .directive('validateMatch',
    function match ($parse) {
      return {
        require: '?ngModel',
        restrict: 'A',
        link: function(scope, elem, attrs, ctrl) {
          if(!ctrl) {
            return;
          }

          var matchGetter = $parse(attrs.validateMatch);
          var caselessGetter = $parse(attrs.matchCaseless);
          var noMatchGetter = $parse(attrs.notMatch);

          scope.$watch(getMatchValue, function(){
            ctrl.$$parseAndValidate();
          });

          ctrl.$validators.match = function(){
            var match = getMatchValue();
            var notMatch = noMatchGetter(scope);
            var value;

            if(caselessGetter(scope)){
              value = angular.lowercase(ctrl.$viewValue) === angular.lowercase(match);
            }else{
              value = ctrl.$viewValue === match;
            }
            /*jslint bitwise: true */
            value ^= notMatch;
            /*jslint bitwise: false */
            return !!value;
          };

          function getMatchValue(){
            var match = matchGetter(scope);
            if(angular.isObject(match) && match.hasOwnProperty('$viewValue')){
              match = match.$viewValue;
            }
            return match;
          }
        }
      };
    }
  )


  .directive('validatePasswordCharacters', function() {

    var PASSWORD_FORMATS = [
      /[A-Z]+/,     //uppercase letters
      /\d+/         //numbers
      ///[^\w\s]+/, //special characters
      ///\w+/,      //other letters
    ];
    return {
      require: 'ngModel',
      link : function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
          var status = true;
          angular.forEach(PASSWORD_FORMATS, function(regex) {
            status = status && regex.test(value);
          });
          ngModel.$setValidity('password-characters', status);
          return value;
        });
      }
    }
  })

  .directive('validateEmail', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link : function(scope, element, attrs, ngModel) {

        // please note you can name your function & argument anything you like
        function customValidator(ngModelValue) {
          // check if its an email
          if (/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(ngModelValue)) {
            ngModel.$setValidity('invalid-email', true);
          } else {
            ngModel.$setValidity('invalid-email', false);
          }
          return ngModelValue;
        }
        ngModel.$parsers.push(customValidator);

      }

    }
  })