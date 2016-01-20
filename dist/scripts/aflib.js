// master module which includes all other modules
angular.module('af.lib',
  [
    'af.httpInterceptor',
    'af.api',
    'af.apiUtil',
    'af.authManager',
    'af.roleManager',
    'af.bsIcons',
    'af.event',
    'af.filters',
    'af.loader',
    'af.modal',
    'af.msg',
    'af.storage',
    'af.util',
    'af.jwtManager',

  // forms
    'af.directive.formGroup',

  // wrappers
    'af.appEnv',
    'af.appTenant',
    'af.appTrack',
    'af.appCatch',
  // lib wrappers
    'jQuery',
    'amplify',
    '_',
    'moment'

    // these are not included by default
    //'ui.bootstrap.dropdown'
    //'af.validators'
  ]
);