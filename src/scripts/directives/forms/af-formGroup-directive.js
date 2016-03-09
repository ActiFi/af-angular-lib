angular.module('af.formGroup', [])

  .directive("afFormGroup", function() {
    return {
      restrict: "A",
      transclude: true,
      replace: true,
      scope: {
        formGroup: '@',
        formHelp: '@',
        formRequired: '@'
      },
      template: '<div class="form-group"> ' +
                  '<label class="text-capitalize" style="color:#333333;">' +
                    '{{::formGroup}}' +
                    ' <span ng-show="formRequired" class="text-danger required">*</span> ' +
                  '</label> ' +
                  '<div ng-transclude></div> ' +
                  '<p class="help-block" ng-bind-html="::formHelp"></p> ' +
                '</div>',
      compile: function(element, attrs) {
        attrs.formRequired = attrs.formRequired === 'true' ? true:false;
        return function(scope, element, attrs){
          scope.formRequired = attrs.formRequired;
        }
      }
    };
  });