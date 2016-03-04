angular.module('af.headerBar', ['af.appTenant', 'af.authManager', 'af.moduleManager', 'ui.bootstrap.dropdown'])

  .directive('afHeaderBar',  function(appTenant, $window, afAuthManager, afModuleManager) {
    return {
      restrict: "A",
      replace:true,
      scope:{
        afHeaderBar:'@'
      },
      templateUrl:'views/AF/af-header-directive-view.html',
      link:function(scope, elm, attrs){

        scope.modules = afModuleManager.getEnabledModules();
        scope.loggedInUser = afAuthManager.user();

        // enable currentModule:
        _.each(scope.modules, function(module){
          module.active = (module.key == attrs.afHeaderBar);
        });
        scope.currentModule = _.find(scope.modules, 'active');


        scope.clickModule = function(module){
          console.log('TODO...');
          //afModuleManager.redirectToModule(module)
            //.catch(function());
        };

        var getRedirect = function(){
         return attrs.afHeaderBar ?  '&redirect='+attrs.afHeaderBar:'';
        };
        scope.logout = function(){
          afAuthManager.logout();
          $window.location = '/auth/#/login?action=logout'+getRedirect();
        };

        // auto log them out if not valid session
        if(!afAuthManager.isLoggedIn()){
          afAuthManager.logout();
          $window.location = '/auth/#/login?action=invalidsession'+getRedirect();
        };

      }
    };
  });