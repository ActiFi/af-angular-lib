angular.module('af.timeout', ['_'])
  .service('afTimeout', function($timeout, _) {

    var timers = {};

    var afTimeout = null;
    return afTimeout = {

      timeout:function(scope, cb, time){

        // create an array based on this scopes id
        timers[$scope.$id] = timers[$scope.$id] || [];

        // put the timer into our timers list
        timers[$scope.$id].push($timeout(cb, time));

        scope.$on('$destroy', function(){
          console.log($scope.$id);
          // loop over any timers tied to scope and destroy them
          if(timers[$scope.$id]){
            _.each(timers[$scope.$id], function(timer){
              $timeout.cancel(timer);
            });
            delete timers[$scope.$id]; // remove array
          }
        })

      }

    };
  });
