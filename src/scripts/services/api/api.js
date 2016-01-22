angular.module('af.api', ['_', 'af.apiUtil', 'af.msg'])

  .constant('AF_API_CONFIG', {
    autoErrorDisplay:true,    // call msg.error on error
    autoErrorLog:true,        // send errors to sentry
    attachWebToken:true,      // attach webToken to header
    attachSessionToken:false, // attach sessionToken to request params
    urlEncode:false           // send as urlEncoded instead of json
  })

  .service('afApi', function($http, $log, _, $q, afApiUtil, afMsg, AF_API_CONFIG) {

      var afApi = null;
      return afApi = {

        call: function(url, params, options) {

          var defaults = {
            url:url,
            method: options.method || 'post',
            data: params
          };
          var request = _.extend(defaults, AF_API_CONFIG, options);

          // AUTO ATTACH SOME DATA
          // (unless requested off)
          if(request.attachWebToken === true)
            request = afApiUtil.request.attachWebToken(request);
          if(request.attachSessionToken === true)
            request = afApiUtil.request.attachSessionToken(request);
          if(request.urlEncode === true)
            request = afApiUtil.request.urlEncode(request);

          return $http(request)
            .then(function(response){
              return response.data; // return just data on success (drop headers, status etc)
            })
            .catch(function(response){
              afApi.errorHandler(response);
              return $q.reject(response);
            })
        },

        // default response handler
        errorHandler:function(response){
          afApiUtil.error.handler(response);
        }

      };
    });