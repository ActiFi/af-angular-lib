//
// THIS IS GLOBALLY scoped on window because we need it before angular even loads..
//
var appCatch = {

  loaded:false,

  config: {
    uid:'',
    enabled: true,
    options: {
      whitelistUrls:[ 'actifi.com/' ],
      ignoreUrls: [ /extensions\//i, /^chrome:\/\//i ]
    }
  },


  //
  // INITIALIZE
  //
  init:function(uid){
    if(appCatch.loaded)  return;

    // set uid
    appCatch.config.uid = uid;

    // sanity checks
    if(appEnv == void 0)              return console.log('AppCatch - Cannot initialize. appEnv must be defined.');
    if(appEnv.ENV() !== 'production') return console.log('AppTrack - Disabled in ' + appEnv.ENV() + ' environment');
    if(!appCatch.config.enabled)      return console.log('AppCatch - Disabled via config.');
    if(typeof Raven === void 0)       return console.log('AppCatch - ERROR!! Cannot initialize Sentry. Missing Raven library.');
    if(!appCatch.config.uid)          return console.log('AppCatch - ERROR!! Sentry init error. Application Config not defined.');

    // init
    Raven.config(appCatch.config.uid, appCatch.config.options).install();
    console.log('SENTRY - Enabled');
    appCatch.loaded = true;
  },

  isEnabled:function(){
    return appCatch.loaded && appCatch.enabled;
  },


  //
  // METHODS
  //
  // alias
  send:function(message, extra, tags){
    appCatch.error(message, extra, tags);
  },
  error:function(message, extra, tags){
    if(!appCatch.isEnabled()) return;
    console.log('SENTRY - error()', message);
    extra = extra || {};
    tags = tags || {};
    // build options
    var options = { extra:extra, tags:tags };
    // url of error
    options.extra.url = extra.href || window.location.href;
    // tags
    options.tags.env = tags.env || appEnv.ENV();
    options.tags.subDomain = tags.subDomain || tags.host || appEnv.HOST();
    Raven.captureMessage(message, options)
  },

  // additional info about the user that threw error...
  setUser:function(id, email){
    if(!appCatch.isEnabled()) return;
    var user = { id:id };
    if(email) user.email = email;
    console.log('SENTRY - setUser()', user);
    Raven.setUser(user);
  },
  clearUser:function(){
    if(!appCatch.isEnabled()) return;
    console.log('SENTRY - clearUser()');
    Raven.setUser(); // this clears out any current user
  }
};