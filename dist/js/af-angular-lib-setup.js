if (typeof console === "undefined") { var console = { log : function(){} }; }
;
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
    if(afCatch.loaded)  return;

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
;
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

  // global getter
  config : function(path){
    if(!path) return afEnv._config; // return entire config if no path
    return _.get(afEnv._config, path);
  }
};
afEnv.get = afEnv.config; // alias
;
//
// TENANTS CONFIGURATION (labels, theme, etc)
//
var afTenant = {

  _config:{}, // holds config (loaded from db or php, or whatever)

  init:function(config){
    afTenant._config = config;
    console.log('afTenant:', afTenant.get('app.tenant'));
  },

  // quickie makers
  label:function(value, plural){ return afTenant.config('label.'+value, plural)},
  exists:function(path){
    return _.get(afTenant._config, path) !== void 0;
  },
  config:function(path, makePlural){
    if(!path) return afTenant._config; // return entire config if no path
    var value = _.get(afTenant._config, path);
    if(value === void 0) {
      console.log('afTenant.config(' + path + ') MISSING!');
      return '';
    }
    if(makePlural) {
      var customPluralValue = _.get(afTenant._config, path + '_plural');
      if(customPluralValue !== void 0) return customPluralValue;
      return afTenant.makePlural(value);
    }
    return value;
  },

  makePlural:function(value){
    if(typeof value !== 'string' || value === '') return value;
    var lastChar = value.charAt(value.length - 1).toLowerCase();
    var lastTwoChar = value.slice(value.length - 2).toLowerCase();
    // special cases...
    // If the word ends in a vowel (a,e,i,o,u) + y then just add s.
    if (lastChar === 'y' && lastTwoChar !== 'ay' && lastTwoChar !== 'ey' && lastTwoChar !== 'iy' && lastTwoChar !== 'oy' && lastTwoChar !== 'uy')
      return value.slice(0, value.length - 1) + 'ies';
    if (lastTwoChar === 'ch') return value + 'es';
    if (lastTwoChar === 'ss') return value + 'es';
    return value + 's';
  }

};
afTenant.get = afTenant.config; // alias
;
//
// THIS IS GLOBALLY scoped on window because we need it before angular even loads..
//
var afTrack = {

  loaded: false,

  config: {
    uid:'',
    enabled: true,
    options: {
      'cross_subdomain_cookie': false,
      'debug':false
    },
    globals:{},
    globalUsageDelay:3600000 // 1 per an hour
  },


  //
  // INITIALIZE
  //
  init:function(uid){
    if(afTrack.loaded) return;

    // set uid
    afTrack.config.uid = uid;

    // sanity checks
    if(afEnv == void 0)              return console.log('AfTrack - Cannot initialize. afEnv must be defined.');
    if(afEnv.ENV() !== 'production') return console.log('AfTrack - Disabled in ' + afEnv.ENV() + ' environment');
    if(afCatch == void 0)            return console.log('AfTrack - Cannot initialize. afCatch must be defined.');
    if(!afTrack.config.enabled)      return console.log('afTrack - Disabled via config.');

    if(amplify == void 0)             return afCatch.send('AfTrack - Cannot initialize. amplify must be loaded first.');
    if(_ == void 0)                   return afCatch.send('AfTrack - Cannot initialize. lodash must be loaded first.');
    if(!afTrack.config.uid)          return afCatch.send('AfTrack - Cannot initialize. uid not defined.');
    if(typeof mixpanel === void 0)    return afCatch.send('AfTrack - Cannot initialize. mixpanel must be defiend.');

    // init
    mixpanel.init(afTrack.config.uid, afTrack.config.options);
    // always pass these with events:
    afTrack.config.globals = {
      'Domain': afEnv.HOST(),
      'Tenant': afEnv.TENANT_HASH(),
      'Browser Version':navigator.sayswho,
      'App': afEnv.APP()
    };
    mixpanel.register(afTrack.config.globals);
    console.log('MIXPANEL - Enabled');
    afTrack.loaded = true;
  },

  isEnabled:function(){
    return (afTrack.loaded && afTrack.config.enabled && amplify.store('mixpanel_trackUserStats')) ? true:false;
  },


  //
  // WHO stats are tracked for
  //
  // can disable/enable after init by setting a cached setting
  trackUserStats:function(value){
    amplify.store('mixpanel_trackUserStats', value);
  },
  setUserId: function (userId) {
    if(!afTrack.loaded) return;
    amplify.store('mixpanel_trackUserId', userId);
    mixpanel.identify(userId);
  },
  getUserId:function(){
    if(!afTrack.loaded) return;
    return amplify.store('mixpanel_trackUserId');
  },
  setProfile: function (object) {
    if(!afTrack.loaded) return;
    mixpanel.people.set(object);
  },


  //
  // METHODS
  //
  // mixpanel.track("Register", {"Gender": "Male", "Age": 21}, 'Auth');
  send: function (name, tags, globalModule) { afTrack.track(name, tags, globalModule); }, // alias
  track: function (name, tags, globalModule) {
    if(!afTrack.isEnabled()) return;
    mixpanel.track(name, tags);
    if(globalModule) afTrack.trackGlobalUsage(globalModule);
  },
  trackGlobalUsage:function(module){
    module = module || 'Other';
    if(!afTrack.isEnabled() || !afTrack.getUserId()) return;
    var key = 'mixpanel_globalUsage_'+module+'-'+afTrack.getUserId();
    if(amplify.store(key)) return; // tracked recently?
    afTrack.send('Global Usage', { Module:module });
    afTrack.increment('Global Usage');
    // cache so we don't send again right away...
    amplify.store(key, true, { expires:afTrack.config.globalUsageDelay });
  },
  increment:function(name){
    if(!afTrack.isEnabled() || !afTrack.getUserId()) return;
    mixpanel.people.increment(name);
  },

  // Register a set of super properties, which are automatically included with all events.
  // { key:value }
  register: function (options) {
    if(!afTrack.isEnabled()) return;
    mixpanel.register(options);
  },
  // removes a registered key
  unregister: function (key) {
    if(!afTrack.isEnabled()) return;
    mixpanel.unregister(key);
  },



  //
  // METHODS
  //
  TRACK_LOGIN:function(type, from, to){
    afTrack.send('Login', {'Login Type':type, 'Login Via':_.capitalize(from), 'Login To':_.capitalize(to) });
  },
  PageView:function(name){
    afTrack.send('Page View');
  }
};



//
// MIXPANEL LIB
//
(function(f,b){if(!b.__SV){var a,e,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.track_charge people.clear_charges people.delete_user".split(" ");
  for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=f.createElement("script");a.type="text/javascript";a.async=!0;a.src="//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";e=f.getElementsByTagName("script")[0];e.parentNode.insertBefore(a,e)}})(document,window.mixpanel||[]);

// gets browser version
navigator.sayswho= (function(){
  var ua= navigator.userAgent, tem,
      M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if(/trident/i.test(M[1])){
    tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
    return 'IE '+(tem[1] || '');
  }
  if(M[1]=== 'Chrome'){
    tem= ua.match(/\bOPR\/(\d+)/);
    if(tem!= null) return 'Opera '+tem[1];
  }
  M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
  if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
  return M.join(' ');
})();