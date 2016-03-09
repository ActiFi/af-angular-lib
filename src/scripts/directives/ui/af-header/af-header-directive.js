angular.module('af.headerBar', ['af.appTenant', 'af.authManager', 'af.moduleManager', 'ui.bootstrap.dropdown'])


  .provider('afHeaderBarConfig', function(){
    this.templateUrl = '/tenant/assets/templates/af-header-directive-view.html';
    this.showAppDropDown = true;
    this.showHelpDropDown = true;
    this.$get = function () { return this; };
  })

  .directive('afHeaderBar',  function(appTenant, $window, afAuthManager, afModuleManager, afHeaderBarConfig) {
    return {
      restrict: "A",
      replace:true,
      scope:{
        afHeaderBar:'@'
      },
      templateUrl:afHeaderBarConfig.templateUrl,
      link:function(scope, elm, attrs){

        scope.loggedInUser = afAuthManager.user();
	
        scope.showAppDropDown = afHeaderBarConfig.showAppDropDown;
        scope.showHelpDropDown = afHeaderBarConfig.showHelpDropDown;

        scope.modules = afModuleManager.getUserAccessibleModules();

        // enable currentModule:
        _.each(scope.modules, function(module){
          module.active = (module.key == attrs.afHeaderBar);
        });
        scope.currentModule = _.find(scope.modules, 'active');
        if(!scope.currentModule) scope.currentModule = {label:'Switch App'};



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