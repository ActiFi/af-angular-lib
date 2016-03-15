angular.module('af.breadcrumb', ['af.tenant', 'af.authManager', 'af.redirectionManager', 'af.catch', 'af.msg', 'af.moduleManager', 'ui.bootstrap.dropdown'])

    .service('afBreadcrumbService', function(){
      return {
        crumbs:[]
      }
    })

    // config
    .provider('afBreadcrumbConfig', function(){
      this.templateUrl = '/tenant/assets/templates/af-breadcrumb-directive-view.html';
      this.showAppDropDown = true;
      this.$get = function () { return this; };
    })

    .directive('afBreadcrumb',  function(afBreadcrumbService, afCatch, afMsg, afTenant, $window, afAuthManager, afRedirectionManager, afModuleManager, afBreadcrumbConfig) {

      var afBreadcrumb = {
        restrict: "A",
        replace:true,
        scope:{
          afBreadcrumb:'@'
        },
        templateUrl:afBreadcrumbConfig.templateUrl,
        link:function(scope, elm, attrs){

          scope.showAppDropDown = afBreadcrumbConfig.showAppDropDown;
          scope.modules = afModuleManager.getUserAccessibleModules();


          _.each(scope.modules, function(module){
            module.active = (module.key == attrs.afBreadcrumb);
          });

          scope.currentModule = _.find(scope.modules, 'active');
          if(!scope.currentModule) scope.currentModule = {label:'Switch App'};

          scope.clickModule = function(desiredModule){
            afRedirectionManager.changeApp(desiredModule.key)
              .catch(function(response){
                afCatch.send('afHeaderBar. Failed to redirect to ' + desiredModule);
                afMsg.error('Failed to redirect');
              });
          };

          scope.$watch(function(){
            return afBreadcrumbService.crumbs
          }, function(newValue){
            scope.crumbs = newValue;
          });

        }
      };

      return afBreadcrumb;
    });