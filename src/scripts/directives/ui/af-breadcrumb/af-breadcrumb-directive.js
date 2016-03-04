angular.module('af.breadcrumb', ['af.appTenant', 'af.authManager', 'af.moduleManager', 'ui.bootstrap.dropdown'])

    .service('afBreadcrumbService', function(){
      return {
        crumbs:[]
      }
    })
    .provider('afBreadcrumbConfig', function(){
      var config = {
        templateUrl :'/tenant/assets/templates/af-breadcrumb-directive-view.html'
      };
      this.setShowAppDropDown = function (value) { config.showAppDropDown = value; };
      this.setTemplateUrl = function (templateUrl) {
        config.templateUrl = templateUrl;
      };
      this.$get = function () { return config; };
    })
    .directive('afBreadcrumb',  function(afBreadcrumbService, appTenant, $window, afAuthManager, afModuleManager, afBreadcrumbConfig) {

      var afBreadcrumb = {
        restrict: "A",
        replace:true,
        scope:{
          afBreadcrumb:'@'
        },
        templateUrl:afBreadcrumbConfig.templateUrl,
        link:function(scope, elm, attrs){

          scope.showAppDropDown = afBreadcrumbConfig.showAppDropDown;
          scope.modules = afModuleManager.getModulesForDropDown();


          _.each(scope.modules, function(module){
            module.active = (module.key == attrs.afBreadcrumb);
          });

          scope.currentModule = _.find(scope.modules, 'active');
          if(!scope.currentModule) scope.currentModule = {label:'Switch App'};

          scope.clickModule = function(module){
            $window.location.href = '/'+module.key+'/';
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