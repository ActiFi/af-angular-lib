angular.module('af.headerBar', ['af.appTenant', 'af.authManager', 'af.moduleManager', 'ui.bootstrap.dropdown'])


  .provider('afHeaderBarConfig', function(){
    var config = {
      templateUrl :'/tenant/assets/templates/af-header-directive-view.html'
    };
    this.setTemplateUrl = function (templateUrl) {
      config.templateUrl = templateUrl;
    };
    this.$get = function () { return config; };
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