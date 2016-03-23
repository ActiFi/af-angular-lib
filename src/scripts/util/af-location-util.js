
angular.module('af.locationUtil', [])
  .service('afLocationUtil', function($window, $location) {

    var afLocationUtil = null;
    return afLocationUtil = {

      protocolAndHost: function () {
        return $window.location.protocol + '//' + $window.location.host;
      },

      search: function (key) {
        // quick check to see if key is even in url at all...
        if (key && $location.absUrl().indexOf(key) < 0) return null;

        var vars = $location.search();
        var search = $window.location.search;

        if (search) {
          var params = search.split('&');
          _.each(params, function (param, i) {
            var parts;
            parts = param.replace('#', '').replace('/', '').replace('?', '').split('=');
            return vars[parts[0]] = decodeURIComponent(parts[1]);
          });
        }
        if (key) {
          if (vars[key]) return vars[key];
          if (vars[key.toLowerCase()]) return vars[key.toLowerCase()];
          return null;
        }
        return vars;
      },

      postFormData: function (url, params, newWindow, method) {
        var date, form, winName;
        if (!_.isBoolean(newWindow))
          newWindow = true;
        method = method || 'post';
        form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", url);
        _.each(params, function (value, key) {
          var hiddenField, type;
          type = typeof value;
          if (type === 'function' || type === 'object') {
            return;
          }
          hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", value);
          return form.appendChild(hiddenField);
        });
        if (newWindow) {
          date = new Date();
          winName = 'af_postWindow' + date.getTime();
          window.open('', winName);
          form.target = winName;
          document.body.appendChild(form);
          form.submit();
        } else {
          document.body.appendChild(form);
          form.submit();
        }
        return document.body.removeChild(form);
      }

    }
  });