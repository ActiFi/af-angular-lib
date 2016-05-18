//
// THIS IS GLOBALLY scoped on window because we need it before angular even loads..
//
var afCatch = {

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
    if(afCatch.loaded) return;

    // set uid
    afCatch.config.uid = uid;

    // sanity checks
    if(afEnv == void 0)              return console.log('AfCatch - Cannot initialize. afEnv must be defined.');
    if(afEnv.ENV() !== 'production') return console.log('AfCatch - Disabled in ' + afEnv.ENV() + ' environment');
    if(!afCatch.config.enabled)      return console.log('AfCatch - Disabled via config.');
    if(typeof Raven === void 0)      return console.log('AfCatch - ERROR!! Cannot initialize Sentry. Missing Raven library.');
    if(!afCatch.config.uid)          return console.log('AfCatch - ERROR!! Sentry init error. Application Config not defined.');

    // init
    Raven.config(afCatch.config.uid, afCatch.config.options).install();
    console.log('SENTRY - Enabled');
    afCatch.loaded = true;
  },

  isEnabled:function(){
    return afCatch.loaded && afCatch.enabled;
  },


  //
  // METHODS
  //
  // alias
  send:function(message, extra, tags){
    afCatch.error(message, extra, tags);
  },
  error:function(message, extra, tags){
    extra = extra || {};
    tags = tags || {};
    // build options
    var options = { extra:extra, tags:tags };
    // url of error
    options.extra.url = extra.href || window.location.href;
    if(options.extra.password) options.extra.password = '******';
    // tags
    options.tags.env = tags.env || afEnv.ENV();
    options.tags.subDomain = tags.subDomain || tags.host || afEnv.HOST();

    if(!afCatch.isEnabled()){
      console.log('SENTRY DISABLED - error()', message, options);
      return;
    }
    console.log('SENTRY - error()', message);
    Raven.captureMessage(message, options)
  },

  // additional info about the user that threw error...
  setUser:function(id, email){
    if(!afCatch.isEnabled()) return;
    var user = { id:id };
    if(email) user.email = email;
    console.log('SENTRY - setUser()', user);
    Raven.setUser(user);
  },
  clearUser:function(){
    if(!afCatch.isEnabled()) return;
    console.log('SENTRY - clearUser()');
    Raven.setUser(); // this clears out any current user
  }
};