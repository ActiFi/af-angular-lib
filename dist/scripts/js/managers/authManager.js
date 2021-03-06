(function() {
  var myApp;

  myApp = angular.module('af.authManager', ['af.util']);

  myApp.service('authManager', function($util) {
    var auth;
    return auth = {
      loggedInUser: {
        userName: amplify.store("userName"),
        userId: amplify.store("userId"),
        userEmail: amplify.store("userEmail"),
        authorities: amplify.store("authorities")
      },
      sessionToken: amplify.store('sessionToken'),
      clearUser: function() {
        amplify.store('username', null);
        amplify.store('userId', null);
        amplify.store('userEmail', null);
        amplify.store('authorities', null);
        amplify.store('sessionToken', null);
        auth.loggedInUser.username = null;
        auth.loggedInUser.userId = null;
        auth.loggedInUser.userEmail = null;
        auth.loggedInUser.authorities = null;
        return auth.sessionToken = null;
      },
      setSessionToken: function(token) {
        amplify.store('sessionToken', token);
        return auth.sessionToken = token;
      },
      setLoggedInUser: function(user) {
        var fields;
        fields = _.pick(user, 'userName', 'userId', 'userEmail', 'authorities');
        auth.loggedInUser = fields;
        return _.each(fields, function(field) {
          return amplify.store(field, user[field]);
        });
      },
      findSessionToken: function(priority) {
        var token;
        token = null;
        if (!priority) {
          priority = ['app', 'amplify', 'url', 'window'];
        }
        _.each(priority, function(place) {
          if (token) {
            return;
          }
          switch (place) {
            case 'app':
              token = auth.sessionToken;
              break;
            case 'amplify':
              token = amplify.store('sessionToken');
              break;
            case 'url':
              token = $util.GET('sessionToken');
              break;
            case 'window':
              token = window.sessionToken;
          }
          return token;
        });
        return token;
      },
      hasRole: function(role) {
        if (!auth.loggedIn()) {
          return false;
        }
        return _.contains(auth.loggedInUser.authorities, role);
      },
      hasAnyRole: function(array) {
        var matched;
        matched = 0;
        _.each(array, function(role) {
          if (auth.hasRole(role)) {
            return matched += 1;
          }
        });
        return matched > 0;
      },
      hasAllRoles: function(array) {
        var matched;
        matched = 0;
        _.each(array, function(role) {
          if (auth.hasRole(role)) {
            return matched += 1;
          }
        });
        return array.length === matched;
      },
      isAdmin: function() {
        return auth.hasAnyRole(['Role_Admin', 'Role_RoadmapUserAdmin', 'Role_RoadmapContentAdmin']);
      },
      isManager: function() {
        return auth.hasAnyRole(['Role_AccessKeyManager']);
      },
      loggedIn: function() {
        return auth.sessionToken && auth.loggedInUser.userId;
      }
    };
  });

}).call(this);
