//
// SERVER CONFIGURATION (ENV, TENANT_HASH, TENANT_INDEX, etc)
//
var afEnv = {
  _config:{}, // holds config (loaded from db or php, or whatever)
  init:function(config, app){
    if(!config.ENV)           throw new Error('afEnv.init failed. ENV not defined');
    if(!config.TENANT_HASH)   throw new Error('afEnv.init failed. TENANT_HASH not defined');
    if(!config.TENANT_INDEX)  throw new Error('afEnv.init failed. TENANT_INDEX not defined');
    if(!app)                  throw new Error('afEnv.init failed. must specify app'); // eg, portal, auth, metrics, assessment etc...
    afEnv._config = config;
    afEnv._config.HOST = window.location.protocol + "//" + window.location.host;
    afEnv._config.APP = app;

    // log it...
    console.log('afEnv', afEnv._config);
  },
  ENV:function(){ return afEnv._config.ENV },
  TENANT_HASH:function(){ return afEnv._config.TENANT_HASH },
  TENANT_INDEX:function(){ return afEnv._config.TENANT_INDEX },
  SENTRY:function(){ return afEnv._config.SENTRY },
  MIXPANEL:function(){ return afEnv._config.MIXPANEL },
  HOST:function(){ return afEnv._config.HOST },
  APP:function(){ return afEnv._config.APP },
  VERSION:function(){ return afEnv._config.VERSION },

  // global getter
  config : function(path){
    if(!path) return afEnv._config; // return entire config if no path
    return _.get(afEnv._config, path);
  }
};
afEnv.get = afEnv.config; // alias