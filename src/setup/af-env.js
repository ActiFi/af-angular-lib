//
// SERVER CONFIGURATION (ENV, TENANT_HASH, TENANT_INDEX, etc)
//
var afEnv = {

  _config:{}, // holds config (loaded from db or php, or whatever)

  init:function(config){
    if(!config)               throw new Error('afEnv.init failed. config not defined');
    if(!config.ENV)           throw new Error('afEnv.init failed. ENV not defined');
    if(!config.TENANT_HASH)   throw new Error('afEnv.init failed. TENANT_HASH not defined');
    if(!config.TENANT_INDEX)  throw new Error('afEnv.init failed. TENANT_INDEX not defined');
    if(!config.APP)           throw new Error('afEnv.init failed. must specify APP'); // eg, portal, auth, metrics, assessment etc...
    afEnv._config = config;
    afEnv._config.HOST = window.location.protocol + "//" + window.location.host;
    if(!afEnv._config.SENTRY){
      var sentryProd = 'https://c62072b6aefc4bf1bd217382b9b7dad5@app.getsentry.com/27961';
      var sentryDev = 'https://656d24f28bbd4037b64638a4cdf6d61d@app.getsentry.com/26791';
      afEnv._config.SENTRY = (afEnv._config.ENV == 'development') ? sentryDev:sentryProd;
    }
    if(!afEnv._config.MIXPANEL){
      var mixpanelProd = 'd0695354d367ec464143a4fc30d25cd5';
      var mixpanelDev = 'd71bf20acd263bf696cfdc594ef80ce6';
      afEnv._config.MIXPANEL = (afEnv._config.ENV == 'development') ? mixpanelDev:mixpanelProd;
    }

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
  VERSION:function(){ return afEnv._config.VERSION }

};
afEnv.get = afEnv.config; // alias