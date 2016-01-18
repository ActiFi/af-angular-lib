
angular.module('af.apiUtil', ['af._'])
    .service('afApiUtil', function(_) {

      var afApiUtil = null;
      return afApiUtil = {

        isHTTPResponse:function(response){
          return (_.has(response, 'headers') && _.has(response, 'status'));
        },

        isJsend:function(response){
          var data = response;
          if(afApiUtil.isHTTPResponse(response))
            data = response.data;

          if(!_.has(data, 'status')) return false;
          if(data.status == 'success' && _.has(data, 'data')) return true;
          if(data.status == 'error' && _.has(data, 'message')) return true;
          return false;
        },

        getErrorMessageFromResponse:function(response){

          var defaultMessage = 'An unexpected error has occurred.';

          // simple string error
          if(_.isString(response))
            return response;

          // object error
          if(_.has(response, 'message'))
            return response.message || defaultMessage;

          //
          if(afApiUtil.isHTTPResponse(response) && _.has(response, 'data') && _.has(response.data, 'message'))
              return response.data.message || defaultMessage;

          return defaultMessage;
        }

      }

    });