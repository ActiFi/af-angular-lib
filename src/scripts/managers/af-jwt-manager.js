
angular.module('af.jwtManager', ['af.appCatch', 'moment'])

    .service('afJwtManager', function($window, $log, appCatch, moment) {

      function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
          case 0:
            break;
          case 2:
            output += '==';
            break;
          case 3:
            output += '=';
            break;
          default:
            throw 'Illegal base64url string!';
        }
        if($window.atob){
          return $window.atob(output);
        } else if($window.Base64) {
          return $window.Base64.atob(output);
        }
        appCatch.error('jwtManager: Failed to decode webToken, atob not supported');
        return null;
      }

      var afJwtManager = null;
      return afJwtManager = {

        decode:function(token){
          if(!token) return false;
          token = (''+token); // ensure string
          if(token.indexOf('.') < 0){
            appCatch.error('Invalid JWT ' + token);
            return null;
          }
          var encoded = token.split('.')[1];
          var decoded = JSON.parse(urlBase64Decode(encoded));
          if(afJwtManager.hasExpired(decoded)){
            $log.info('Token has expired');
            return false;
          }
          return decoded;
        },

        hasExpired:function(decodedToken){
          if(!decodedToken || !decodedToken.exp) return true;
          var expiresOn = afJwtManager.getExpiresOn(decodedToken.exp);
          return moment().isAfter(expiresOn) ? true:false;
        },

        getExpiresOn:function(exp){
          return moment(exp, 'X');
        },

        millisecondsTillExpires:function(exp){
          var expiresAt = afJwtManager.getExpiresOn(exp);
          var diffInMill = expiresAt.diff(moment());
          return diffInMill;
        }

      };
    });