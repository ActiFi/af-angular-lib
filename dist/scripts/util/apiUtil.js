
angular.module('af.apiUtil', ['_', 'af.appCatch', 'af.authManager', 'af.msg'])
    .service('afApiUtil', function(_, appCatch, $log, afAuthManager, $location, afMsg, jQuery) {

      var afApiUtil = null;
      return afApiUtil = {

        response:{

          isHTTPResponse:function(response){
            return (_.has(response, 'headers') && _.has(response, 'status'));
          },
          isJsend:function(response){
            var data = response;
            if(afApiUtil.response.isHTTPResponse(response))
              data = response.data;
            if(!_.has(data, 'status')) return false;
            if(data.status == 'success' && _.has(data, 'data')) return true;
            if(data.status == 'error' && _.has(data, 'message')) return true;
            return false;
          }

        },


        request:{
          attachWebToken:function(request){
            var token = afAuthManager.webToken();
            request.headers.authorization = token;
            return request;
          },
          attachSessionToken:function(request){
            var token = afAuthManager.sessionToken();
            request.data = request.data || {};
            request.data.sessionToken = token;
            return request;
          },
          isFileRequest:function(request){
            return request.url.substr(request.url.length - 5).indexOf('.') >= 0
          },
          // convert request into a urlEncoded request instead of json
          urlEncode:function(request){
            request.headers = request.headers || {};
            _.extend(request.headers, { 'Content-Type':'application/x-www-form-urlencoded' });
            // data needs to be in string format
            if(!_.isString(request.data))
              request.data = jQuery.param(request.data);
            return request;
          }
        },


        error:{

          //
          // CREATE CONSISTENT ERROR BASED ON A WIDE VARIETY OF SERVER RESPONSES
          //
          getError:function(response){
            // already made consistent?
            if(_.has(response, 'data') && _.has(response.data, 'isConsistent'))
              return response.data;

            var err = null;
            var errorObject = {
              code:500,
              message:'An unexpected error has occurred.',
              name:'UnexpectedError',
              status:'error',
              debug:{
                url:$location.absUrl()
              },
              isConsistent:true // flag for later
            };

            // string?
            if(_.isString(response) && (response !== '' && response !== 'undefined' && response !== 'null')){
              errorObject.message = response;

            // http response
            } else if(afApiUtil.response.isHTTPResponse(response)){
              // pass status and statusText over
              if(response.status !== 200) errorObject.code = response.status;
              if(response.statusText) errorObject.name = response.statusText;
              // if we received any jsend error data... use that instead
              err = response.data || {};
              if(err.code) errorObject.code = err.code;
              if(err.name) errorObject.name = err.name;
              if(err.message && (''+err.message).indexOf('<?xml') !== 0) errorObject.message = err.message;
              // attach additional debug if
              if(_.has(response, 'config')){
                if(_.has(response.config, 'password'))
                  response.config.password = '******';
                errorObject.debug = _.extend({}, errorObject.debug, response.config);
              }

            // some other object response...
            } else if(_.isPlainObject(response)){
              err = response;
              if(err.code) errorObject.code = err.code;
              if(err.name) errorObject.name = err.name;
              if(err.message && (''+err.message).indexOf('<?xml') !== 0) errorObject.message = err.message;
            }
            return errorObject;
          },

          displayError:function(response){
            var error = afApiUtil.error.getError(response);
            afMsg.error(error.message);
          },

          logError:function(response){
            // get consistent error format
            var error = afApiUtil.error.getError(response);
            // log it
            if(afApiUtil.response.isHTTPResponse(response)){
              $log.error(error, response.headers, response.data);
            } else{
              $log.error(error);
            }

            // send to sentry
            appCatch.send(error.message, error.debug);
          }
        }

      }

    });