angular.module('af.sideBar', ['af.appTenant', 'amplify', 'af.authManager', 'af.moduleManager', 'ui.bootstrap.dropdown'])

  .directive('afSideBar',  function(appTenant, $window, amplify, afAuthManager, afModuleManager) {
    return {
      restrict: "A",
      replace:true,
      transclude:true,
      templateUrl:'views/AF/af-sidebar-directive-view.html',
      link:function(scope, elm, attrs){

        var stateRestored = false;

        var init = function(){
          stateRestore();
        };

        scope.doSearch = function(){
          alert('todo')
        };

        scope.toggle = function(){
          scope.managerBarOpen = scope.managerBarOpen ? false:true;
        };

        //
        // CACHE STATE OF DIRECTIVE FROM APP TO APP
        //
        scope.$watch('managerBarOpen', function(newValue){
          stateSave();
        });
        var stateRestore = function(){
          stateRestored = true;
          var state = amplify.store('afSideBar_state');
          if(!state) return;
          scope.managerBarOpen = state.managerBarOpen;
        };
        var stateSave = function(){
          // don't save if we havent restored yet.
          // this would overwrite a saved state.
          if(!stateRestored) return;
          var state = {
            managerBarOpen:scope.managerBarOpen
          };
          amplify.store('afSideBar_state', state); //, { expires:1000 * 60 * 60 })
        };

        init();
      }
    };
  });