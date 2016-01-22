//
// SERVER CONFIGURATION (ENV, TENANT_HASH, TENANT_INDEX, etc)
//
var appEnv = {
  _config:{}, // holds config (loaded from db or php, or whatever)
  init:function(config, app){
    if(!config.ENV)           throw new Error('appEnv.init failed. ENV not defined');
    if(!config.TENANT_HASH)   throw new Error('appEnv.init failed. TENANT_HASH not defined');
    if(!config.TENANT_INDEX)  throw new Error('appEnv.init failed. TENANT_INDEX not defined');
    if(!app)                  throw new Error('appEnv.init failed. must specify app'); // eg, portal, auth, metrics, assessment etc...
    appEnv._config = config;
    appEnv._config.HOST = window.location.protocol + "//" + window.location.host;
    appEnv._config.APP = app;

    // log it...
    console.log('appEnv', appEnv._config);
  },
  ENV:function(){ return appEnv._config.ENV },
  TENANT_HASH:function(){ return appEnv._config.TENANT_HASH },
  TENANT_INDEX:function(){ return appEnv._config.TENANT_INDEX },
  SENTRY:function(){ return appEnv._config.SENTRY },
  MIXPANEL:function(){ return appEnv._config.MIXPANEL },
  HOST:function(){ return appEnv._config.HOST },
  APP:function(){ return appEnv._config.APP },

  // global getter
  config : function(path){
    if(!path) return appEnv._config; // return entire config if no path
    return _.get(appEnv._config, path);
  }
};
appEnv.get = appEnv.config; // alias