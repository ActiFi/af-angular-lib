// master module which includes all other modules
angular.module('af.lib',
  [
  // DIRECTIVES
    //'af.formMessenger',         // not part of default build
    //'af.directive.formGroup',   // not part of default build
    //'af.validators'           // not part of default build
    'af.bar',
    //'af.headerBar',           // not part of default build
    //'af.breadcrumb',          // not part of default build
    //'af.sideBar',             // not part of default build
    //'ui.bootstrap.dropdown'   // not part of default build
    'af.bsIcons',
  // FILTERS
    'af.filters',
  // MANAGERS
    'af.authManager',
    'af.jwtManager',
    'af.moduleManager',
    'af.redirectionManager',
    'af.roleManager',
    'af.screenManager',
  // SERVICES
    'af.api',
    'af.httpInterceptor',
  // SHIMS
    //'ng.shims.placeholder'    // not part of default build
  // SYSTEM
    'af.event',
    'af.loader',
    'af.modal',
    'af.msg',
    'af.storage',
    'af.appEnv',
    'af.appTenant',
    'af.appTrack',
    'af.appCatch',
    '$',
    'amplify',
    '_',
    'moment',
  // UTIL
    'af.apiUtil',
    'af.util'
  ]
);