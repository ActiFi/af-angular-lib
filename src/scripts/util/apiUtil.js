
angular.module('af.apiUtil', ['_', 'af.appCatch', 'af.authManager', 'af.msg'])
    .service('afApiUtil', function(_, appCatch, $log, afAuthManager, $location, afMsg, $) {

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
            if(token && token !== '') {
              request.headers = request.headers || {};
              request.headers.authorization = 'Bearer ' + token;
            }
            return request;
          },
          attachTenantIndex:function(request){
            var tenant = appEnv.TENANT_INDEX();
            request.data = request.data || {};
            request.data.tenant = tenant;
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
              request.data = $.param(request.data);
            return request;
          }
        },

        error:{

          // default error handler
          handler:function(response){
            // get consistent error object
            var error = afApiUtil.error.getError(response);

            // log all error to console
            console.log(error);

            var request = _.has(response, 'config') ? response.config : null;

            // send to sentry?
            if(!request || request.autoErrorLog === true)
              afApiUtil.error.logError(response);

            // display message on UI with afMsg?
            if(!request || request.autoErrorDisplay === true)
              afApiUtil.error.displayError(response);
          },


          //
          // CREATE CONSISTENT ERROR BASED ON A WIDE VARIETY OF SERVER RESPONSES
          //
          getError:function(response){
            // already made consistent?
            if(_.has(response, 'errorObject'))
              return response.errorObject;

            var err = null;
            var errorObject = {
              code:500,
              message:'An unexpected error has occurred.',
              name:'UnexpectedError',
              status:'error',
              debug:{
                url:$location.absUrl()
              }
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
              if(err.message) errorObject.message = err.message;
              if(_.isString(err)) {
                // api returned html?
                if(err.indexOf('<?xml') == 0 || err.indexOf('<!') == 0)
                  errorObject.message = errorObject.code + ' ' + afApiUtil.error.getErrCodeLabel(errorObject.code);
                else
                  errorObject.message = err;
              }

              // attach additional debug if
              if(_.has(response, 'config')){
                var params = _.has(response.config, 'data') ? response.config.data:{};
                if(_.has(params, 'password'))
                  params.password = '******';
                // create debug object
                errorObject.debug = _.extend({}, errorObject.debug, {
                  url:$location.absUrl(),
                  requestUrl:response.config.url,
                  requestMethod:response.config.method,
                  headers:response.config.headers,
                  params:params
                });
              }

            // some other object response...
            } else if(_.isPlainObject(response)){
              err = response;
              if(err.code) errorObject.code = err.code;
              if(err.name) errorObject.name = err.name;
              if(err.message && (''+err.message).indexOf('<?xml') !== 0) errorObject.message = err.message;
            }

            // save if this gets called again...
            response.errorObject = errorObject;

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
            $log.error(error);
            // send to sentry
            appCatch.send(error.message, error.debug);
          },

          getErrCodeLabel:function(code){
            if(_.has(afApiUtil.http_codes, code))
              return afApiUtil.http_codes[code];
            return 'Unknown Error'
          }
        },


        http_codes : {
          100: 'Continue',
          101: 'Switching Protocols',
          102: 'Processing',
          200: 'OK',
          201: 'Created',
          202: 'Accepted',
          203: 'Non-Authoritative Information',
          204: 'No Content',
          205: 'Reset Content',
          206: 'Partial Content',
          207: 'Multi-Status',
          300: 'Multiple Choices',
          301: 'Moved Permanently',
          302: 'Found',
          303: 'See Other',
          304: 'Not Modified',
          305: 'Use Proxy',
          306: 'Switch Proxy',
          307: 'Temporary Redirect',
          400: 'Bad Request',
          401: 'Unauthorized',
          402: 'Payment Required',
          403: 'Forbidden',
          404: 'Not Found',
          405: 'Method Not Allowed',
          406: 'Not Acceptable',
          407: 'Proxy Authentication Required',
          408: 'Request Timeout',
          409: 'Conflict',
          410: 'Gone',
          411: 'Length Required',
          412: 'Precondition Failed',
          413: 'Request Entity Too Large',
          414: 'Request-URI Too Long',
          415: 'Unsupported Media Type',
          416: 'Requested Range Not Satisfiable',
          417: 'Expectation Failed',
          418: 'I\'m a teapot',
          422: 'Unprocessable Entity',
          423: 'Locked',
          424: 'Failed Dependency',
          425: 'Unordered Collection',
          426: 'Upgrade Required',
          449: 'Retry With',
          450: 'Blocked by Windows Parental Controls',
          500: 'Internal Server Error',
          501: 'Not Implemented',
          502: 'Bad Gateway',
          503: 'Service Unavailable',
          504: 'Gateway Timeout',
          505: 'HTTP Version Not Supported',
          506: 'Variant Also Negotiates',
          507: 'Insufficient Storage',
          509: 'Bandwidth Limit Exceeded',
          510: 'Not Extended'
        }
      }

    });