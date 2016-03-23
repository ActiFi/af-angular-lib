Number.prototype.formatNumber = function(precision, decimal, seperator) {
  var i, j, n, s;
  n = this;
  precision = (isNaN(precision = Math.abs(precision)) ? 0 : precision);
  decimal = (decimal === undefined ? "." : decimal);
  seperator = (seperator === undefined ? "," : seperator);
  s = (n < 0 ? "-" : "");
  i = parseInt(n = Math.abs(+n || 0).toFixed(precision)) + "";
  j = ((j = i.length) > 3 ? j % 3 : 0);
  return s + (j ? i.substr(0, j) + seperator : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + seperator) + (precision ? decimal + Math.abs(n - i).toFixed(precision).slice(2) : "");
};

angular.module('af.formatUtil', ['_', 'moment', 'af.tenant'])
  .service('afFormatUtil', function(_, moment, afTenant) {

    var isTruthy = function(value){
      return (value === 'true' || value === true || value == '1' || value === 1)
    };

    var afFormatUtil = null;
    return afFormatUtil = {

      createDisplayName:function(user, preference){
        if(!user) return 'Unknown User';

        var fullName = function(user){
          if(user.firstName && user.lastName)
            return user.firstName + ' ' + user.lastName;
          return null;
        };

        if(!preference)
          preference = afTenant.config('app.preferredDisplayName');

        if(preference && preference == 'nameOfPractice'){
          if(user.nameOfPractice) return user.nameOfPractice;
          if(fullName(user)) return fullName(user);
        } else {
          if(fullName(user)) return fullName(user);
          if(user.nameOfPractice) return user.nameOfPractice;
        }
        return user.firstName || user.lastName || user.username || user.nameOfPractice || 'User ' + user.userId;
      },

      number:{
        // floating point error fix
        floatFix:function(number, precision){
          var precision = precision || 2,
              correction = Math.pow(10, precision);
          return Math.round(correction * number)/correction;
        },
        nc:afFormatUtil.number.floatFix // alias
      },

      string: {

        nl2br: function (string) {
          if (!string || typeof string != 'string') return string;
          return string.replace(/(?:\r\n|\r|\n)/g, '<br />');
          //return str.replace(/\n\r?/g, '<br />');
        },
        br2nl:function (string){
          if (!string || typeof string != 'string') return string;
          return string.replace(/<br>/g, "\r");
        },

        // clean junk from a string to get the number out...
        toNumber:function(value){
          if(_.isNil(value)) return null;
          var negativeSign = (''+value).substr(0,1) === '-' ? '-':'';
          var pattern = /[^\.\d]/g,
              cleaned = (''+value).replace(pattern,'');
          return parseFloat(negativeSign + cleaned);
        }
      },

      format: {
        date: function(value, format, inputType) {
          if (!value)     return '';
          if (!moment)    return value;
          if (!inputType) inputType = "utc";
          if(!format)     format = afTenant.config('settings.dates.format') || 'MM/DD/YY';
          if (typeof value === 'string') {
            switch (inputType.toLowerCase()) {
              case 'utc':
                inputType = "YYYY-MM-DDTHH:mm:ss ZZ";
                break;
              case 'asp':
                inputType = null;
                break;
            }
            return moment(value, inputType).format(format);
          } else {
            return moment(value).format(format);
          }
        },
        number: function(value, precision, type, showSymbol) {
          if(_.isString(value)) value = parseFloat(value);
          if(!_.isFinite(value)) return '';
          // save if its negative...
          var negativeSign = (''+value).substr(0,1) === '-' ? '-':'';
          // strip everything except periods and numbers
          var pattern = /[^\.\d]/g,
              cleaned = (''+value).replace(pattern,'');
          // format it
          cleaned = parseFloat(cleaned);
          cleaned.formatNumber(precision || 0);
          // show symbol?
          if(_.isUndefined(showSymbol) || _.isNull(showSymbol)) showSymbol = true;

          showSymbol = isTruthy(showSymbol);
          var symbol = '';
          if(showSymbol){
            switch((''+type).toLowerCase()){
              case 'currency': symbol = '$'; break;
              case 'percent': symbol = '%'; break;
            }
          }
          // return it all
          switch((''+type).toLowerCase()){
            case 'currency':
              return negativeSign + symbol + parseFloat(cleaned).formatNumber(precision || 0);
            case 'percent':
              return negativeSign + parseFloat(cleaned * 100).formatNumber(precision || 0) + symbol;
            default :
              return negativeSign + parseFloat(cleaned).formatNumber(precision || 0);
          }
        },
        currency: function(value, precision, showSymbol) {
          return afFormatUtil.format.number(value, precision, 'currency', showSymbol);
        },
        percent: function(value, precision, showSymbol) {
          return afFormatUtil.format.number(value, precision, 'percent', showSymbol);
        },
        targetValue:function(value, type, precision){
          switch((''+type).toLowerCase()){
            case 'hours':
            case 'number':    return afFormatUtil.format.number(value, precision);
            case 'currency':  return afFormatUtil.format.currency(value, precision);
            case 'percent':   return afFormatUtil.format.percent(value, precision);
            case 'textarea':  return afFormatUtil.string.nl2br(value);
            case 'text':      return value;
          }
          return value;
        }
      },

      unFormat:{
        percent:function(value, precision){
          return afFormatUtil.unFormat.number(value, precision, 'percent');
        },
        currency:function(value, precision){
          return afFormatUtil.unFormat.number(value, precision, 'currency');
        },
        number:function(value, precision, type){
          if(_.isNull(value) || _.isUndefined(value) || value === '') return null;

          // sanity checks
          if(!precision) precision = 0;
          if(!type) type = 'number'; // number or percent
          type = (''+type).toLowerCase();

          var showDecimal = precision > 0;
          var negativeSign = (''+value).substr(0,1) === '-' ? '-':'';

          // strip everything except periods and numbers
          var pattern = /[^\.\d]/g,
              cleaned = (''+value).replace(pattern,'');

          // has decimal?
          var decimalPlace = cleaned.indexOf('.');
          if(decimalPlace >= 0){
            var split = cleaned.split('.');
            cleaned = split[0];
            if(showDecimal){
              // if percent... need to add 2 to precision for correct rounding
              var numDecimals = type == 'percent' ? precision+2 : precision;
              var decimal = split[1].substr(0, numDecimals); // no rounding currently.
              cleaned += '.' + decimal;
            }
          }

          // replace negative sign
          cleaned = negativeSign + cleaned;
          var final = parseFloat(cleaned);

          // get correct value if its a percent
          if(type == 'percent') final = afFormatUtil.number.floatFix(final / 100, precision+2);
          if(_.isNaN(final) || _.isUndefined(final)) return null;
          return final;
        }
      }

    }

  });