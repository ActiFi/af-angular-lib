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