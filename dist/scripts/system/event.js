
angular.module('af.event', [])

  .constant('$EVENT_CONFIG', {suppress:['Loader.start', 'Loader.stop', 'Msg.clear']} )

  .service('$event', function($rootScope, $log, $EVENT_CONFIG) {

    var logEvent = function(type, eventName, data) {
      if(!_.contains($EVENT_CONFIG.suppress, eventName))
        $log.debug('$event.' + type + ': ' + eventName, data);
    };

    var service = null;
    return service = {

      EVENT_loaderStart: 'Loader.start',
      EVENT_loaderStop: 'Loader.stop',
      EVENT_msgClear: 'Msg.clear',
      EVENT_msgShow: 'Msg.show',

      shout: function(eventName, data) {
        logEvent('shout', eventName, data);
        return $rootScope.$broadcast(eventName, data);
      },
      broadcast: function($scope, eventName, data) {
        logEvent('broadcast', eventName, data);
        return $scope.$broadcast(eventName, data);
      },
      emit: function($scope, eventName, data) {
        logEvent('emit', eventName, data);
        return $scope.$emit(eventName, data);
      }
    };

  });