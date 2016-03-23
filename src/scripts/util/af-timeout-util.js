angular.module('af.timeoutUtil', ['_'])
  .service('afTimeoutUtil', function($timeout, $interval) {

    var timeouts = {};
    var intervals = {};
    var scopes = {};

    var watchScopeForCleanup = function(scopeId){
      // only setup 1 listener
      if(!_.has(scopes, scopeId)){
        // store the fact we added a listener. (so we don't do it again)
        scopes[scopeId] = scopeId;
        // put listener onto scope for cleanup
        scope.$on('$destroy', function(){
          if(timeouts[scopeId]){
            _.each(timeouts[scopeId], $timeout.cancel);   // cancel each timer tied to scope
            delete timeouts[scopeId];                     // remove the array
          }
          if(intervals[scopeId]){
            _.each(intervals[scopeId], $interval.cancel); // cancel each timer tied to scope
            delete intervals[scopeId];                    // remove the array
          }
        })
      }
    };


    var afTimeoutUtil = null;
    return afTimeoutUtil = {

      timeout:function(scope, cb, delay){
        // create an array to hold the promises if it doest exist
        timeouts[scope.$id] = timeouts[scope.$id] || [];
        // put the timer into our timeouts list
        timeouts[scope.$id].push($timeout(cb, delay));
        watchScopeForCleanup(scope.$id);
      },

      interval:function(scope, cb, tick){
        // create an array to hold the promises if it doest exist
        intervals[scope.$id] = intervals[scope.$id] || [];
        // put the interval into our intervals list
        intervals[scope.$id].push($interval(cb, delay));
        watchScopeForCleanup(scope.$id);
      }

    };
  });
