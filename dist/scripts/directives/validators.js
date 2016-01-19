
angular.module('af.validators', [])

  .directive('validateMatches', function() {
    return {
      require: 'ngModel',
      link : function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
          var scope2 = scope;
          var attr2 = attrs;
          var value2 = scope.$eval(attrs.validateMatches)
          ngModel.$setValidity('matches', value == scope.$eval(attrs.validateMatches));
          return value;
        });
      }
    }
  })
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