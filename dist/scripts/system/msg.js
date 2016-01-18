
angular.module('af.msg', ['af.event', 'af._'])

  .service('afMsg', function(afEvent) {
    var afMsg = null;
    return afMsg = {

      shownAt: null,
      minVisible: 3,

      show: function(message, type, options) {

        options = options || {};
        if (_.isNumber(options.delay) && options.delay < afMsg.minVisible)
          options.delay = afMsg.minVisible;

        afMsg.shownAt = new Date().getTime();

        return afEvent.shout(afEvent.EVENT_msgShow, {
          message: message,
          type:    type,
          options: options
        });
      },

      clear: function(force) {
        var now = new Date().getTime();
        if (force || (afMsg.shownAt && (now - afMsg.shownAt) > afMsg.minVisible))
          return afEvent.shout(afEvent.EVENT_msgClear);
      },

      alert:   function(message, options) { return afMsg.show(message, 'warning', options); },
      error:   function(message, options) { return afMsg.show(message, 'danger',  options); },
      danger:  function(message, options) { return afMsg.show(message, 'danger',  options); },
      info:    function(message, options) { return afMsg.show(message, 'info',    options); },
      success: function(message, options) { return afMsg.show(message, 'success', options); }
    };
  })


  .directive('msgHolder', function($timeout, $window, afEvent) {
    var timer = null;
    return {
      restrict: 'A',
      template: '<div id="app-alert" class="ng-cloak">' +
                  '<div class="app-alert-container container" ng-show="visible">' +
                    '<div class="alert" ng-class="cssClass">' +
                      '<button type="button" class="close" ng-show="!closable" ng-click="clear()">×</button>' +
                      '<span ng-bind-html="message"></span>' +
                    '</div>' +
                  '</div>' +
                '</div>',
      link: function(scope, element, attrs) {

        scope.message = null;
        scope.type = null;
        scope.closable = true;

        scope.visible = false;

        var showMessage = function(message, type, options) {

          var types = ['warning', 'danger', 'info', 'success'];
          if(!_.contains(types, type)) type = 'warning';

          scope.message = message;
          scope.closable = options.closable;
          scope.visible = true;

          scope.cssClass = 'alert-' + type;

          if(scope.delay)
            scope.cssClass += ' alert-dismissable';

          // clear after delay?
          if (timer)
            $timeout.cancel(timer);

          if(_.isNumber(options.delay) && options.delay > 0) {
            timer = $timeout(function() {
              scope.clear();
            }, options.delay * 1000);
          }
        };

        scope.clear = function() {
          scope.visible = false;
          if (timer) $timeout.cancel(timer);
        };

        scope.$on(afEvent.EVENT_msgShow, function(event, data) {
          showMessage(data.message, data.type, data.options);
        });

        scope.$on(afEvent.EVENT_msgClear, scope.clear);

      }
    };
  });
