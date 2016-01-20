
angular.module('af.roleManager', ['_', 'af.authManager'])

    .service('afRoleManager', function(_, afAuthManager) {

      //
      // ROLES
      //
      var ROLE_ADMIN = 'Role_Admin';                    // FULL ADMIN ACCESS
      var ROLE_ROADMAP_MANAGER = 'Role_RoadmapManager'; // MANAGER IN ROADMAP
      var ROLE_METRICS_MANAGER = 'Role_MetricsManager'; // MANAGER IN METRICS

      // todo: this role was a hack.
      // someday remove this as it should not be a role... ffs.
      var ROLE_ON_COACH_REPORT = 'Role_OnCoachReport'; // user shows up on report as a coach.


      var SYSTEM_ROLES = [
        ROLE_ADMIN,
        ROLE_ROADMAP_MANAGER,
        ROLE_METRICS_MANAGER,
        ROLE_ON_COACH_REPORT
      ];

      var getLoggedInUserRoles = function(){
        var user = afAuthManager.user();
        if(!user || !_.isArray(user.roles)) return [];
        return user.roles;
      };

      var roleCheck = function(arrayOfRoles){
        var numOfMatches = 0;
        _.each(arrayOfRoles, function(role) {
          if (afRoleManager.hasRole(role)) {
            return numOfMatches += 1;
          }
        });
        return numOfMatches;
      };

      var afRoleManager = null;
      return afRoleManager = {

        //
        // GETTERS
        //
        getRoles : function(name){          return SYSTEM_ROLES; },
        getRole_ADMIN:function(){           return ROLE_ADMIN; },
        getRole_ROADMAP_MANAGER:function(){ return ROLE_ROADMAP_MANAGER; },
        getRole_METRICS_MANAGER:function(){ return ROLE_METRICS_MANAGER; },
        getRole_ON_COACH_REPORT:function(){ return ROLE_ON_COACH_REPORT; },

        //
        // ROLE CHECKERS
        //
        hasRole: function(role) {
          return _.includes(getLoggedInUserRoles(), role);
        },
        hasAnyRole: function(array) {
          var matches = roleCheck(array);
          return matches > 0;
        },
        hasAllRoles: function(array) {
          var matches = roleCheck(array);
          return matches === array.length;
        },
        // EASY MAKERS
        isAdmin: function() {
          return afRoleManager.hasRole(ROLE_ADMIN);
        },
        isManager: function() {
          return afRoleManager.isRoadmapManager() || afRoleManager.isMetricsManager();
        },
        isRoadmapManager:function(){
          return afRoleManager.hasRole(ROLE_ROADMAP_MANAGER);
        },
        isMetricsManager:function(){
          return afRoleManager.hasRole(ROLE_METRICS_MANAGER);
        }


      }
    });