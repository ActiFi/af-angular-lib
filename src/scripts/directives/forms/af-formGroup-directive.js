angular.module('af.formGroup', [])

  .directive("afFormGroup", function() {
    return {
      restrict: "A",
      transclude: true,
      replace: true,
      scope: {
        afFormGroup: '@',
        formHelp: '@',
        formRequired: '@'
      },
      template: '<div class="form-group"> ' +
                  '<label style="color:#333333;">' +
                    '{{::afFormGroup}}' +
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