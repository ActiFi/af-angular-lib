angular.module('af.httpInterceptor', ['_', 'af.apiUtil'])
  .factory("afHttpInterceptor", function($q, _, afApiUtil) {

    var afHttpInterceptor = null;
    return afHttpInterceptor = {

      // REQUEST
      //request: function(request) { return request; },


      // RESPONSE 200 SUCCESS
      response: function(response){
        var request = response.config;
        if(!request || afApiUtil.request.isFileRequest(request))
          return response;

        // A 200 success can still be an error with jsend
        var isJsend = afApiUtil.response.isJsend(response);
        var isError = (isJsend && response.data.status === 'error');

        if (isError) {
          return $q.reject(response);
        } else {
          // strip jsend out... return just the data.
          if(isJsend) response.data = response.data.data;
          return response;
        }
      }

      // RESPONSE ERROR
      //responseError: function(response) { return $q.reject(response); }

    };
  });

