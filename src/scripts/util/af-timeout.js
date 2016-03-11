angular.module('af.timeout', ['_'])
  .service('afTimeout', function($timeout, _) {

    var timers = {};

    var afTimeout = null;
    return afTimeout = {

      timeout:function(scope, cb, timer){

        // create an array based on this scopes id
        timers[$scope.$id] = timers[$scope.$id] || [];

        // put the timer into our timers list
        timers[$scope.$id].push($timeout(cb, timer));

        scope.$on('$destroy', function(){
          if(timers[$scope.$id]){
            _.each(timers[$scope.$id], $timeout.cancel); // cancel each timer
            delete timers[$scope.$id];                   // destroy the scopes timer array
          }
        })

      }
    };
  });
