//
// TENANTS CONFIGURATION (labels, theme, etc)
//
var appEnv = {
  _config:{}, // holds config (loaded from db or php, or whatever)
  init:function(config){
    if(!config.ENV)           throw new Error('appEnv.init failed. ENV not defined');
    if(!config.TENANT_HASH)   throw new Error('appEnv.init failed. TENANT_HASH not defined');
    if(!config.TENANT_INDEX)  throw new Error('appEnv.init failed. TENANT_INDEX not defined');
    appEnv._config.ENV = config.ENV;
    appEnv._config.TENANT_HASH = config.TENANT_HASH;
    appEnv._config.TENANT_INDEX = config.TENANT_INDEX;
    console.log('appEnv', appEnv._config);
  },
  ENV:function(){ return appEnv._config.ENV },
  TENANT_HASH:function(){ return appEnv._config.TENANT_HASH },
  TENANT_INDEX:function(){ return appEnv._config.TENANT_INDEX }
};