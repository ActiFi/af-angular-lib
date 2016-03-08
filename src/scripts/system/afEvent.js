
angular.module('af.event', [])

  // config
  .provider('afEventConfig', function(){
    this.suppress = ['Loader.start', 'Loader.stop', 'Msg.clear'];
    this.$get = function () { return this; };
  })

  .service('afEvent', function($rootScope, $log, afEventConfig) {

    var logEvent = function(type, eventName, data) {
      if(!_.includes(afEventConfig.suppress, eventName))
        $log.debug('afEvent.' + type + ': ' + eventName, data);
    };

    var afEvent = null;
    return afEvent = {

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