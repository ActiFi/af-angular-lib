angular.module('af.bsIcons', [])

  .directive('bsIcon', function() {
    return {
      scope:{
        bsIcon:'='
      },
      compile:function(elm, attrs){
        angular.element(elm).addClass('ng-show-inline glyphicon');
        var linkFunction = function(scope, elm, attrs){
          scope.$watch('bsIcon', function(newValue, oldValue){
            angular.element(elm).removeClass('fa-'+oldValue).addClass('fa-'+newValue);
          })
        };
        return linkFunction;
      }
    };
  })

  .directive("faIcon", function() {
    return {
      scope:{
        faIcon:'='
      },
      compile:function(elm, attrs){
        angular.element(elm).addClass('ng-show-inline fa');
        var linkFunction = function(scope, elm, attrs) {
          var getIcon = function(icon){
            switch((''+icon).toLowerCase()){
              case 'roadmap':       return 'road';
              case 'assessment':    return 'check-circle-o';
              case 'quickcontent':
              case 'quick content': return 'file-text-o';
              case 'export':        return 'file';
              case 'pdf':           return 'file-pdf-o';
              case 'rtf':           return 'file-word-o';
              case 'csv':           return 'file-excel-o';
            }
            return icon;
          };
          scope.$watch('faIcon', function(newValue, oldValue){
            var icon = getIcon(newValue);
            var oldIcon = getIcon(oldValue);
            angular.element(elm).removeClass('fa-'+oldIcon).addClass('fa-'+icon);
          })
        };
        return linkFunction;
      }
    };
  });
