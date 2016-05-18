//angular.module('af.headerBar', ['af.authManager', 'af.catch', 'af.msg', 'af.redirectionManager', 'af.moduleManager', 'ui.bootstrap.dropdown'])
angular.module('af.headerMenu', ['af.authManager', 'af.catch', 'af.msg', 'ui.bootstrap.dropdown'])


  .provider('afHeaderMenuConfig', function(){
    this.templateUrl = '/tenant/assets/templates/af-header-directive-view.html';
    this.showModules = true;
    this.showHelpDropDown = true;
    this.showSettings = true;
    this.showProfile = true;
    this.$get = function () { return this; };
  })

  .directive('afHeaderMenu',  function(afAuthManager, afCatch, afMsg, afRedirectionManager, afModuleManager, afHeaderMenuConfig) {
    return {
      restrict: "A",
      replace:true,
      scope:{
        afHeaderBar:'@'
      },
      //templateUrl:afHeaderMenuConfig.templateUrl,
      link:function(scope, elm, attrs){

        scope.loggedInUser = afAuthManager.user();

        scope.showProfile = afHeaderMenuConfig.showProfile;
        scope.showSettings = afHeaderMenuConfig.showSettings;
        scope.showModules = true;
        scope.showHelpDropDown = afHeaderMenuConfig.showHelpDropDown;

        scope.modules = [
          {key:'ce', name:'Client Engagement'},
          {key:'processpro', name:'ProcessPro'},
          {key:'admin', name:'Admin'}
        ]
        //scope.modules = afModuleManager.getUserAccessibleModules();
        //
        //// enable currentModule:
        //_.each(scope.modules, function(module){
        //  module.active = (module.key == attrs.afHeaderBar);
        //});
        //scope.currentModule = _.find(scope.modules, 'active');
        //if(!scope.currentModule) scope.currentModule = {label:'Switch App'};
        //
        //
        //scope.clickModule = function(desiredModule){
        //  afRedirectionManager.changeApp(desiredModule.key)
        //      .catch(function(response){
        //        afCatch.send('afHeaderBar. Failed to redirect to ' + desiredModule);
        //        afMsg.error('Failed to redirect');
        //      });
        //};
        scope.logout = function(options){
          afAuthManager.logout();
          afRedirectionManager.logout(options);
        };

      },
      template:'<ul id="af-header-menu" class="nav nav-pills pull-right">'+
                  // HELP
                  '<li ng-if="showHelpDropDown">'+
                    '<div class="btn-group pull-right" dropdown>'+
                      '<button type="button" style="border:none;" dropdown-toggle class="btn btn-default dropdown-toggle">'+
                        //'<span class="tenant-primary-font">Help</span> '+
                        '<span class="fa fa-question-circle text-muted-more"></span> ' +
                        //'<span class="caret"></span>'+
                      '</button>'+
                      '<ul class="dropdown-menu" role="menu">'+
                        '<li><a href="javascript:;"><span fa-icon="comment-o" class="text-gray"></span> Contact Support</a></li>'+
                        '<li class="divider"></li>'+
                        '<li><a href="javascript:;">Online Documentation</a></li>'+
                      '</ul>'+
                    '</div>'+
                  '</li>'+
                   // APP
                  //'<li ng-if="showAppDropDown && modules.length > 1">'+
                  //  '<div class="btn-group pull-right" dropdown>'+
                  //    '<button type="button" style="border:none;" class="btn btn-default dropdown-toggle" dropdown-toggle>'+
                  //      '<span class="tenant-primary-font" ng-bind="::currentModule.label"></span> '+
                  //      '<span class="caret"></span>'+
                  //    '</button>'+
                  //    '<ul class="dropdown-menu" role="menu">'+
                  //      '<li ng-repeat="module in ::modules">'+
                  //        '<a href="javascript:;" ng-click="clickModule(module)">'+
                  //          '<span ng-bind="::module.label"></span>'+
                  //          '<i class="tenant-primary-font" bs-icon="ok" ng-if="module.key == currentModule.key"></i>'+
                  //        '</a>'+
                  //      '</li>'+
                  //    '</ul>'+
                  //  '</div>'+
                  //'</li>'+
                  // USER
                  '<li>'+
                    '<div class="btn-group pull-right" dropdown>'+
                      '<button type="button" style="border:none;" class="btn btn-default dropdown-toggle" dropdown-toggle>'+
                        '<span fa-icon="user" class="text-muted-more visible-xs-inline-block"></span> '+
                        '<span class="hidden-xs tenant-primary-font">{{loggedInUser.fullName}}</span> '+
                        '<span class="caret"></span>'+
                      '</button>'+
                      '<ul class="dropdown-menu" role="menu">'+
                        '<li ng-if="::showProfile" ><a href="javascript:;"><span fa-icon="user" class="text-gray"></span> My Profile</a></li>'+
                        '<li ng-if="::showModules" class="divider"></li>'+
                        '<li ng-repeat="module in ::modules">'+
                          '<a href="javascript:;" ng-click="clickModule(module)">'+
                            '<span ng-bind="::module.name"></span>'+
                            '<i class="tenant-primary-font" bs-icon="ok" ng-if="module.key == currentModule.key"></i>'+
                          '</a>'+
                        '</li>'+
                        '<li ng-if="::showSettings" class="divider"></li>'+
                        '<li ng-if="::showSettings" ><a href="javascript:;"><span fa-icon="cogs" class="text-gray"></span> Settings</a></li>'+
                        '<li class="divider"></li>'+
                        '<li><a href="javascript:;" ng-click="logout()"> Logout</a></li>'+
                      '</ul>'+
                    '</div>'+
                  '</li>'+
                '</ul>'
    };
  });