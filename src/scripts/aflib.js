// master module which includes all other modules
angular.module('af.lib',
  [
  // DIRECTIVES
    //'af.formMessenger',         // not part of default build
    //'af.formGroup',   // not part of default build
    //'af.validators'           // not part of default build
    'af.bar',
    //'af.headerBar',           // not part of default build
    //'af.breadcrumb',          // not part of default build
    //'af.sideBar',             // not part of default build
    //'af.footer',
    //'ui.bootstrap.dropdown'   // not part of default build
    'af.bsIcons',
  // FILTERS
    'af.formatterFilters',
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
    'af.env',
    'af.tenant',
    'af.track',
    'af.catch',
    '$',
    'amplify',
    '_',
    'moment',
  // UTIL
    'af.util' // includes all sub-util modules
  ]
);