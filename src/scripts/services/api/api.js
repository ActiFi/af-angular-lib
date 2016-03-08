angular.module('af.api', ['_', 'af.apiUtil', 'af.msg'])

  // config
  .provider('afApiConfig', function(){
    this.autoErrorDisplay = true;     // call msg.error on error
    this.autoErrorLog = true;         // send errors to sentry
    this.attachJWT = true;            // attach webToken to header
    this.attachSessionToken = false;  // attach sessionToken to request params
    this.attachTenantIndex = true;    // attach db index to request params
    this.urlEncode = false;           // send as urlEncoded instead of json
    this.$get = function () { return this; };
  })

  .service('afApi', function($http, $log, _, $q, afApiUtil, afMsg, afApiConfig) {

      var afApi = null;
      return afApi = {

        call: function(url, params, options) {

          options = options || {};

          var defaults = {
            url:url,
            method: options.method || 'post',
            data: params
          };

          var request = _.extend(defaults, afApiConfig, options);

          // AUTO ATTACH SOME DATA
          // (unless requested off)
          if(request.attachJWT === true)
            request = afApiUtil.request.attachJWT(request);
          if(request.attachSessionToken === true)
            request = afApiUtil.request.attachSessionToken(request);
          if(request.attachTenantIndex === true)
            request = afApiUtil.request.attachTenantIndex(request);
          if(request.urlEncode === true)
            request = afApiUtil.request.urlEncode(request);

          return $http(request)
            .then(function(response){
              return response.data; // return just data on success (drop headers, status etc)
            })
            .catch(function(response){
              afApi.errorHandler(response);
              return $q.reject(response); // continue with rejection... (must be handled by client)
            })
        },

        // default response handler
        errorHandler:function(response){
          afApiUtil.error.handler(response);
        }

      };
    });