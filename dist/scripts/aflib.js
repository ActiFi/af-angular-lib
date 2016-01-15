// master module which includes all other modules
angular.module('af.lib',
  [
    'af.authManager',
    'af.bsIcons',
    'af.event',
    'af.filters',
    'af.loader',
    'af.modal',
    'af.msg',
    'af.storage',
    'af.util',
    'af.jwtManager',

  // wrappers
    'af.appEnv',
    'af.appTenant',
    'af.appTrack',
    'af.appCatch',
    'af.amplify',
    'af._',
    'af.moment'

  // these are not included by default
    //'ui.bootstrap.dropdown'
    //'af.validators'
  ]
);