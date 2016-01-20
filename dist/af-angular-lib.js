// master module which includes all other modules
angular.module('af.lib',
  [
    'af.httpInterceptor',
    'af.api',
    'af.apiUtil',
    'af.authManager',
    'af.bsIcons',
    'af.event',
    'af.filters',
    'af.loader',
    'af.modal',
    'af.msg',
    'af.storage',
    'af.util',
    'af.jwtManager',

  // forms
    'af.directive.formGroup',

  // wrappers
    'af.appEnv',
    'af.appTenant',
    'af.appTrack',
    'af.appCatch',
  // lib wrappers
    'jQuery',
    'amplify',
    '_',
    'moment'

    // these are not included by default
    //'ui.bootstrap.dropdown'
    //'af.validators'
  ]
);
;

;

angular.module('ui.bootstrap.dropdown', [])

  .constant('dropdownConfig', {
    openClass: 'open'
  })

  .service('dropdownService', ['$document', function($document) {
    var openScope = null;

    this.open = function( dropdownScope ) {
      if ( !openScope ) {
        $document.bind('click', closeDropdown);
        $document.bind('keydown', escapeKeyBind);
      }

      if ( openScope && openScope !== dropdownScope ) {
          openScope.isOpen = false;
      }

      openScope = dropdownScope;
    };

    this.close = function( dropdownScope ) {
      if ( openScope === dropdownScope ) {
        openScope = null;
        $document.unbind('click', closeDropdown);
        $document.unbind('keydown', escapeKeyBind);
      }
    };

    var closeDropdown = function( evt ) {
      // This method may still be called during the same mouse event that
      // unbound this event handler. So check openScope before proceeding.
      if (!openScope) { return; }

      var toggleElement = openScope.getToggleElement();
      if ( evt && toggleElement && toggleElement[0].contains(evt.target) ) {
          return;
      }

      openScope.$apply(function() {
        openScope.isOpen = false;
      });
    };

    var escapeKeyBind = function( evt ) {
      if ( evt.which === 27 ) {
        openScope.focusToggleElement();
        closeDropdown();
      }
    };
  }])

  .controller('DropdownController', ['$scope', '$attrs', '$parse', 'dropdownConfig', 'dropdownService', '$animate', function($scope, $attrs, $parse, dropdownConfig, dropdownService, $animate) {
    var self = this,
        scope = $scope.$new(), // create a child scope so we are not polluting original one
        openClass = dropdownConfig.openClass,
        getIsOpen,
        setIsOpen = angular.noop,
        toggleInvoker = $attrs.onToggle ? $parse($attrs.onToggle) : angular.noop;

    this.init = function( element ) {
      self.$element = element;

      if ( $attrs.isOpen ) {
        getIsOpen = $parse($attrs.isOpen);
        setIsOpen = getIsOpen.assign;

        $scope.$watch(getIsOpen, function(value) {
          scope.isOpen = !!value;
        });
      }
    };

    this.toggle = function( open ) {
      return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
    };

    // Allow other directives to watch status
    this.isOpen = function() {
      return scope.isOpen;
    };

    scope.getToggleElement = function() {
      return self.toggleElement;
    };

    scope.focusToggleElement = function() {
      if ( self.toggleElement ) {
        self.toggleElement[0].focus();
      }
    };

    scope.$watch('isOpen', function( isOpen, wasOpen ) {
      $animate[isOpen ? 'addClass' : 'removeClass'](self.$element, openClass);

      if ( isOpen ) {
        scope.focusToggleElement();
        dropdownService.open( scope );
      } else {
        dropdownService.close( scope );
      }

      setIsOpen($scope, isOpen);
      if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
        toggleInvoker($scope, { open: !!isOpen });
      }
    });

    $scope.$on('$locationChangeSuccess', function() {
      scope.isOpen = false;
    });

    $scope.$on('$destroy', function() {
      scope.$destroy();
    });
  }])

  .directive('dropdown', function() {
    return {
      controller: 'DropdownController',
      link: function(scope, element, attrs, dropdownCtrl) {
        dropdownCtrl.init( element );
      }
    };
  })

  .directive('dropdownToggle', function() {
    return {
      require: '?^dropdown',
      link: function(scope, element, attrs, dropdownCtrl) {
        if ( !dropdownCtrl ) {
          return;
        }

        dropdownCtrl.toggleElement = element;

        var toggleDropdown = function(event) {
          event.preventDefault();

          if ( !element.hasClass('disabled') && !attrs.disabled ) {
            scope.$apply(function() {
              dropdownCtrl.toggle();
            });
          }
        };

        element.bind('click', toggleDropdown);

        // WAI-ARIA
        element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
        scope.$watch(dropdownCtrl.isOpen, function( isOpen ) {
          element.attr('aria-expanded', !!isOpen);
        });

        scope.$on('$destroy', function() {
          element.unbind('click', toggleDropdown);
        });
      }
    };
  })

;
(function() {


  angular.module('af.bsIcons', [])

  .directive('bsIcon', function() {
    return {
      compile:function(elm, attrs){
        angular.element(elm).addClass('ng-show-inline glyphicon glyphicon-' + attrs.bsIcon);
      }
    };
  })

  .directive("faIcon", function() {
    return {
      compile: function(elm, attrs) {
        switch((''+attrs.faIcon).toLowerCase()){
          case 'roadmap': attrs.faIcon = 'road'; break; //'map-marker';
          case 'assessment': attrs.faIcon = 'check-circle-o'; break;
          case 'quickcontent':
          case 'quick content':
            attrs.faIcon = 'file-text-o'; break;
          case 'export':  attrs.faIcon = 'file'; break;
          case 'pdf':     attrs.faIcon = 'file-pdf-o'; break;
          case 'rtf':     attrs.faIcon = 'file-word-o'; break;
          case 'csv':     attrs.faIcon = 'file-excel-o'; break;
        }
        angular.element(elm).addClass('ng-show-inline fa fa-' + attrs.faIcon);
      }
    };
  })

}).call(this);
;

;
angular.module('af.directive.formGroup', [])

  .directive("formGroup", function() {
    return {
      restrict: "A",
      transclude: true,
      replace: true,
      scope: {
        formGroup: '@',
        formHelp: '@',
        formRequired: '@'
      },
      template: '<div class="form-group"> ' +
                  '<label class="text-capitalize" style="color:#333333;">' +
                    '{{::formGroup}}' +
                    ' <span ng-show="formRequired" class="text-danger required">*</span> ' +
                  '</label> ' +
                  '<div ng-transclude></div> ' +
                  '<p class="help-block" ng-bind-html="::formHelp"></p> ' +
                '</div>',
      compile: function(element, attrs) {
        attrs.formRequired = attrs.formRequired === 'true' ? true:false;
        return function(scope, element, attrs){
          scope.formRequired = attrs.formRequired;
        }
      }
    };
  });
;

angular.module('af.validators', [])
    
  .directive('validateMatch',
    function match ($parse) {
      return {
        require: '?ngModel',
        restrict: 'A',
        link: function(scope, elem, attrs, ctrl) {
          if(!ctrl) {
            return;
          }

          var matchGetter = $parse(attrs.validateMatch);
          var caselessGetter = $parse(attrs.matchCaseless);
          var noMatchGetter = $parse(attrs.notMatch);

          scope.$watch(getMatchValue, function(){
            ctrl.$$parseAndValidate();
          });

          ctrl.$validators.match = function(){
            var match = getMatchValue();
            var notMatch = noMatchGetter(scope);
            var value;

            if(caselessGetter(scope)){
              value = angular.lowercase(ctrl.$viewValue) === angular.lowercase(match);
            }else{
              value = ctrl.$viewValue === match;
            }
            /*jslint bitwise: true */
            value ^= notMatch;
            /*jslint bitwise: false */
            return !!value;
          };

          function getMatchValue(){
            var match = matchGetter(scope);
            if(angular.isObject(match) && match.hasOwnProperty('$viewValue')){
              match = match.$viewValue;
            }
            return match;
          }
        }
      };
    }
  )


  .directive('validatePasswordCharacters', function() {

    var PASSWORD_FORMATS = [
      /[A-Z]+/,     //uppercase letters
      /\d+/         //numbers
      ///[^\w\s]+/, //special characters
      ///\w+/,      //other letters
    ];
    return {
      require: 'ngModel',
      link : function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
          var status = true;
          angular.forEach(PASSWORD_FORMATS, function(regex) {
            status = status && regex.test(value);
          });
          ngModel.$setValidity('password-characters', status);
          return value;
        });
      }
    }
  })

  .directive('validateEmail', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link : function(scope, element, attrs, ngModel) {

        // please note you can name your function & argument anything you like
        function customValidator(ngModelValue) {
          // check if its an email
          if (/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/.test(ngModelValue)) {
            ngModel.$setValidity('invalid-email', true);
          } else {
            ngModel.$setValidity('invalid-email', false);
          }
          return ngModelValue;
        }
        ngModel.$parsers.push(customValidator);

      }

    }
  })
;

;

angular.module('af.filters', ['af.appTenant'])


  // eg {{'user.name' | appTenant}}
  // <span ng-bind="'user' | tenantLabel | plural"></span>

  .filter('appTenant',    function(appTenant) {  return appTenant.config; })
  .filter('tenantConfig', function(appTenant) {  return appTenant.config; }) // alias
  .filter('tenantLabel',  function(appTenant) {  return appTenant.label; })
  .filter('plural',       function(appTenant) {  return appTenant.makePlural; })

  .filter('tenantImage', function(appTenant) {
    return function(file) {
      var tnt = appTenant.config('tenant');
      return '/tenant/' + tnt + '/images/' + tnt + '_' + file;
    };
  });
;

;

angular.module('af.authManager', ['_', 'amplify', 'af.util', 'af.jwtManager'])

  .constant('AF_AUTH_MANAGER_CONFIG', {

    tokenPriority:['url', 'cache', 'window'],
    cacheFor:86400000, // 1 day

    cacheSessionTokenAs:'sessionToken',
    cacheWebTokenAs:'webToken',
    cacheUserAs:'loggedInUser'

  })

  .service('afAuthManager', function(AF_AUTH_MANAGER_CONFIG, $log, afUtil, amplify, afJwtManager, $window) {

    var store = function(key, value, expires){
      expires = expires || AF_AUTH_MANAGER_CONFIG.cacheFor;
      if(_.isNumber(expires))
        expires = {expires:expires};

      if(typeof amplify === void 0) $log.error('Failed to '+key+'. Amplify undefined.');
      amplify.store(key, value, expires);
    };


    var getViaPriority  = function(key, priorities){
      priorities = priorities || AF_AUTH_MANAGER_CONFIG.tokenPriority;
      // cycle through possible locations..
      var value = null;
      _.each(priorities, function(priority) {
        if(value) return;
        switch (priority) {
          case 'url':     value = afUtil.GET(key); break;
          case 'cache':   value = amplify.store(key); break;
          case 'window':  value = $window[key]; break;
        }
      });
      return value;
    };


    var afAuthManager = {

      //
      // JSON WEB TOKEN
      //
      setWebToken:function(jwt){
        var decodedToken = afJwtManager.decode(jwt);
        var timeTillExpires = afJwtManager.millisecondsTillExpires(decodedToken.exp);

        // cache both coded and decoded version till it expires
        store(AF_AUTH_MANAGER_CONFIG.cacheWebTokenAs, jwt, timeTillExpires);
        // cache decoded as user...
        afAuthManager.setUser(decodedToken, timeTillExpires);

        $log.info('afAuthManager - Session Set:', decodedToken);
        $log.info('afAuthManager - Session will expire:', afJwtManager.getExpiresOn(decodedToken.exp).format('YYYY-MM-DD HH:mm:ss'));
      },
      webToken:function(priorities){
        return getViaPriority(AF_AUTH_MANAGER_CONFIG.cacheWebTokenAs, priorities);
      },

      //
      // SESSION TOKEN (DEPRECATED)
      //
      setSessionToken:function(sessionToken){
        store(AF_AUTH_MANAGER_CONFIG.cacheSessionTokenAs, sessionToken);
      },
      sessionToken: function(priorities){
        return getViaPriority(AF_AUTH_MANAGER_CONFIG.cacheSessionTokenAs, priorities);
      },


      //
      // USER
      //
      setUser:function(user, expires){
        store(AF_AUTH_MANAGER_CONFIG.cacheUserAs, user, expires);
        // support old apps
        store('userName',     user.username, expires);
        store('userId',       user.userId, expires);
        store('userEmail',    user.email, expires);
        store('authorities',  user.authorities, expires);
        store('tenantId',     user.tenant, expires);
      },
      user:function(){
        return amplify.store(AF_AUTH_MANAGER_CONFIG.cacheUserAs);
      },
      userId:function(){
        var user = afAuthManager.user();
        if(user && user.userId) return user.userId;
        return null;
      },



      //
      // MISC
      //
      isLoggedIn:function(){
        return afAuthManager.user() && (afAuthManager.sessionToken() || afAuthManager.webToken())
      },
      // CLEAR / LOGOUT
      clear: function() {
        amplify.store(AF_AUTH_MANAGER_CONFIG.cacheSessionTokenAs, null);
        amplify.store(AF_AUTH_MANAGER_CONFIG.cacheWebTokenAs, null);
        amplify.store(AF_AUTH_MANAGER_CONFIG.cacheUserAs, null);
      }
    };
    // alias
    afAuthManager.logout = afAuthManager.clear;

    return afAuthManager;
});
;

angular.module('af.jwtManager', ['moment'])

    .service('afJwtManager', function($window, $log, moment) {

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
        $log.error('jwtManager: Failed to decode webToken, atob not supported');
        return null;
      }

      var afJwtManager = null;
      return afJwtManager = {

        decode:function(token){
          if(!token) return false;
          var encoded = token.split('.')[1];
          var decoded = JSON.parse(urlBase64Decode(encoded));
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
        },

      };
    });
;

;

;
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
;
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


;

;
/*! angular-shims-placeholder - v0.4.5 - 2015-07-01
* https://github.com/cvn/angular-shims-placeholder
* Copyright (c) 2015 Chad von Nau; Licensed MIT */
!function(a,b,c){"use strict";a.module("ng.shims.placeholder",[]).service("placeholderSniffer",["$document",function(a){this.emptyClassName="empty",this.hasPlaceholder=function(){var b=a[0].createElement("input");return void 0!==b.placeholder}}]).directive("placeholder",["$timeout","$document","$interpolate","$injector","placeholderSniffer",function(d,e,f,g,h){if(h.hasPlaceholder())return{};var i=!1,j=parseFloat(a.version.full);try{var k=g.get("$animate")}catch(l){}return{restrict:"A",require:"?ngModel",priority:j>=1.2?110:-10,link:function(g,l,m,n){function o(a){var b=l.val();l.hasClass(O)&&b&&b===N||p(function(){q(b)},a)}function p(a,c){b.documentMode<=11&&c?d(a,0):a()}function q(a){a||0===a||u(J)?(l.removeClass(O),l.val(a)):(l.addClass(O),l.val(M?"":N)),M&&(x(),k&&y())}function r(){return n?g.$eval(m.ngModel)||"":s()||""}function s(){var a=l.val();return a===m.placeholder&&(a=""),a}function t(a,b){l.hasClass(O)&&l.val()===N&&l.val(""),N=a,o(b)}function u(a){var c=!1;try{c=a===b.activeElement}catch(d){}return c}function v(a,b,c,d){c?a.attr(b,d):a.removeAttr(b)}function w(){H=a.element('<input type="text" value="'+N+'"/>'),A(),C(H),H.addClass(O).bind("focus",F),J.parentNode.insertBefore(H[0],J);for(var b=[m.ngDisabled,m.ngReadonly,m.ngRequired,m.ngShow,m.ngHide],c=0;c<b.length;c++)b[c]&&g.$watch(b[c],z)}function x(){A(),G()?C(H):l.hasClass(O)&&J!==b.activeElement?D():E()}function y(){j>=1.3?k.addClass(l,"").then(x):k.addClass(l,"",x)}function z(){k?y():x()}function A(){H.val(N),H.attr("class",l.attr("class")||"").attr("style",l.attr("style")||"").prop("disabled",l.prop("disabled")).prop("readOnly",l.prop("readOnly")).prop("required",l.prop("required")),v(H,"unselectable","on"===l.attr("unselectable"),"on"),v(H,"tabindex",l.attr("tabindex")!==c,l.attr("tabindex"))}function B(a){j>=1.2?a.removeClass(P):a.css("display","")}function C(a){j>=1.2?a.addClass(P):a.css("display","none")}function D(){C(l),B(H)}function E(){C(H),B(l)}function F(){E(),J.focus()}function G(){var a="undefined"!=typeof m.ngShow,b="undefined"!=typeof m.ngHide;return a||b?a&&!g.$eval(m.ngShow)||b&&g.$eval(m.ngHide):!1}var H,I=r(),J=l[0],K=J.nodeName.toLowerCase(),L="input"===K||"textarea"===K,M="password"===m.type,N=m.placeholder||"",O=h.emptyClassName,P="ng-hide";L&&(m.$observe("placeholder",function(a){t(a)}),M&&w(),q(I),l.bind("focus",function(){l.hasClass(O)&&(l.val(""),l.removeClass(O),J.select())}),l.bind("blur",o),n||l.bind("change",function(a){t(f(l.attr("placeholder")||"")(g),a)}),n&&(n.$render=function(){q(n.$viewValue),u(J)&&!l.val()&&J.select()}),i||(e.bind("selectstart",function(b){var c=a.element(b.target);c.hasClass(O)&&c.prop("disabled")&&b.preventDefault()}),i=!0))}}}])}(window.angular,window.document);
;
/*
 * $Id: base64.js,v 2.15 2014/04/05 12:58:57 dankogai Exp dankogai $
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 */

(function(global) {
  'use strict';
  // existing version for noConflict()
  var _Base64 = global.Base64;
  var version = "2.1.9";
  // if node.js, we use Buffer
  var buffer;
  if (typeof module !== 'undefined' && module.exports) {
    try {
      buffer = require('buffer').Buffer;
    } catch (err) {}
  }
  // constants
  var b64chars
    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  var b64tab = function(bin) {
    var t = {};
    for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
    return t;
  }(b64chars);
  var fromCharCode = String.fromCharCode;
  // encoder stuff
  var cb_utob = function(c) {
    if (c.length < 2) {
      var cc = c.charCodeAt(0);
      return cc < 0x80 ? c
        : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
      + fromCharCode(0x80 | (cc & 0x3f)))
        : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
      + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
      + fromCharCode(0x80 | ( cc         & 0x3f)));
    } else {
      var cc = 0x10000
        + (c.charCodeAt(0) - 0xD800) * 0x400
        + (c.charCodeAt(1) - 0xDC00);
      return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
      + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
      + fromCharCode(0x80 | ((cc >>>  6) & 0x3f))
      + fromCharCode(0x80 | ( cc         & 0x3f)));
    }
  };
  var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
  var utob = function(u) {
    return u.replace(re_utob, cb_utob);
  };
  var cb_encode = function(ccc) {
    var padlen = [0, 2, 1][ccc.length % 3],
      ord = ccc.charCodeAt(0) << 16
        | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
        | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
      chars = [
        b64chars.charAt( ord >>> 18),
        b64chars.charAt((ord >>> 12) & 63),
        padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
        padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
      ];
    return chars.join('');
  };
  var btoa = global.btoa ? function(b) {
    return global.btoa(b);
  } : function(b) {
    return b.replace(/[\s\S]{1,3}/g, cb_encode);
  };
  var _encode = buffer ? function (u) {
      return (u.constructor === buffer.constructor ? u : new buffer(u))
        .toString('base64')
    }
      : function (u) { return btoa(utob(u)) }
    ;
  var encode = function(u, urisafe) {
    return !urisafe
      ? _encode(String(u))
      : _encode(String(u)).replace(/[+\/]/g, function(m0) {
      return m0 == '+' ? '-' : '_';
    }).replace(/=/g, '');
  };
  var encodeURI = function(u) { return encode(u, true) };
  // decoder stuff
  var re_btou = new RegExp([
    '[\xC0-\xDF][\x80-\xBF]',
    '[\xE0-\xEF][\x80-\xBF]{2}',
    '[\xF0-\xF7][\x80-\xBF]{3}'
  ].join('|'), 'g');
  var cb_btou = function(cccc) {
    switch(cccc.length) {
      case 4:
        var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
            |    ((0x3f & cccc.charCodeAt(1)) << 12)
            |    ((0x3f & cccc.charCodeAt(2)) <<  6)
            |     (0x3f & cccc.charCodeAt(3)),
          offset = cp - 0x10000;
        return (fromCharCode((offset  >>> 10) + 0xD800)
        + fromCharCode((offset & 0x3FF) + 0xDC00));
      case 3:
        return fromCharCode(
          ((0x0f & cccc.charCodeAt(0)) << 12)
          | ((0x3f & cccc.charCodeAt(1)) << 6)
          |  (0x3f & cccc.charCodeAt(2))
        );
      default:
        return  fromCharCode(
          ((0x1f & cccc.charCodeAt(0)) << 6)
          |  (0x3f & cccc.charCodeAt(1))
        );
    }
  };
  var btou = function(b) {
    return b.replace(re_btou, cb_btou);
  };
  var cb_decode = function(cccc) {
    var len = cccc.length,
      padlen = len % 4,
      n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
        | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
        | (len > 2 ? b64tab[cccc.charAt(2)] <<  6 : 0)
        | (len > 3 ? b64tab[cccc.charAt(3)]       : 0),
      chars = [
        fromCharCode( n >>> 16),
        fromCharCode((n >>>  8) & 0xff),
        fromCharCode( n         & 0xff)
      ];
    chars.length -= [0, 0, 2, 1][padlen];
    return chars.join('');
  };
  var atob = global.atob ? function(a) {
    return global.atob(a);
  } : function(a){
    return a.replace(/[\s\S]{1,4}/g, cb_decode);
  };
  var _decode = buffer ? function(a) {
    return (a.constructor === buffer.constructor
      ? a : new buffer(a, 'base64')).toString();
  }
    : function(a) { return btou(atob(a)) };
  var decode = function(a){
    return _decode(
      String(a).replace(/[-_]/g, function(m0) { return m0 == '-' ? '+' : '/' })
        .replace(/[^A-Za-z0-9\+\/]/g, '')
    );
  };
  var noConflict = function() {
    var Base64 = global.Base64;
    global.Base64 = _Base64;
    return Base64;
  };
  // export Base64
  global.Base64 = {
    VERSION: version,
    atob: atob,
    btoa: btoa,
    fromBase64: decode,
    toBase64: encode,
    utob: utob,
    encode: encode,
    encodeURI: encodeURI,
    btou: btou,
    decode: decode,
    noConflict: noConflict
  };
  // if ES5 is available, make Base64.extendString() available
  if (typeof Object.defineProperty === 'function') {
    var noEnum = function(v){
      return {value:v,enumerable:false,writable:true,configurable:true};
    };
    global.Base64.extendString = function () {
      Object.defineProperty(
        String.prototype, 'fromBase64', noEnum(function () {
          return decode(this)
        }));
      Object.defineProperty(
        String.prototype, 'toBase64', noEnum(function (urisafe) {
          return encode(this, urisafe)
        }));
      Object.defineProperty(
        String.prototype, 'toBase64URI', noEnum(function () {
          return encode(this, true)
        }));
    };
  }
})(this);
;

;
angular.module('af.appCatch', [])
  .service('appCatch', function($window) {
    return $window.appCatch;
  });
;
angular.module('af.appEnv', [])
  .service('appEnv', function($window) {
    return $window.appEnv;
  });
;
angular.module('af.appTenant', [])
  .service('appTenant', function($window) {
    return $window.appTenant;
  });
;
angular.module('af.appTrack', [])
  .service('appTrack', function($window) {
    return $window.appTrack;
  });
;

angular.module('af.event', [])

  .constant('$EVENT_CONFIG', {suppress:['Loader.start', 'Loader.stop', 'Msg.clear']} )

  .service('afEvent', function($rootScope, $log, $EVENT_CONFIG) {

    var logEvent = function(type, eventName, data) {
      if(!_.includes($EVENT_CONFIG.suppress, eventName))
        $log.debug('afEvent.' + type + ': ' + eventName, data);
    };

    var service = null;
    return service = {

      EVENT_loaderStart: 'Loader.start',
      EVENT_loaderStop: 'Loader.stop',
      EVENT_msgClear: 'Msg.clear',
      EVENT_msgShow: 'Msg.show',

      shout: function(eventName, data) {
        logEvent('shout', eventName, data);
        return $rootScope.$broadcast(eventName, data);
      },
      broadcast: function($scope, eventName, data) {
        logEvent('broadcast', eventName, data);
        return $scope.$broadcast(eventName, data);
      },
      emit: function($scope, eventName, data) {
        logEvent('emit', eventName, data);
        return $scope.$emit(eventName, data);
      }
    };

  });
;
angular.module('af.loader', ['af.event'])

  .service('afLoader', function(afEvent) {

    var afLoader = {};
    var isLoading = false;

    return afLoader = {
      start: function(options) {
        isLoading = true;
        return afEvent.shout(afEvent.EVENT_loaderStart, options);
      },
      stop: function() {
        isLoading = false;
        return afEvent.shout(afEvent.EVENT_loaderStop);
      },
      // util / quickies
      isLoading:function(){ return isLoading; },
      saving: function() {  afLoader.start('Saving');    },
      loading: function() { afLoader.start('Loading');  },
      bar: function() {     afLoader.start({bar:true,  mask:false});  },
      mask: function() {    afLoader.start({bar:false, mask:true});  }
    };
  })

  .directive('loaderHolder', function(afEvent, $interval, $log) {
    return {
      restrict: 'A',
      scope: {},
      template: '<div class="ng-cloak">' +
                  '<div id="app-loader-bar" ng-cloak ng-if="loaderBar" class="ng-cloak progress progress-striped active">' +
                    '<div class="progress-bar" style="width:100%"></div>' +
                  '</div>' +
                  '<div id="app-loader-mask" ng-if="loadMask">' +
                    '<div class="loader-mask"></div>' +
                    '<div class="loader-text" ng-if="loaderText">' +
                      '<div class="loader-gear"><span fa-icon="gear" class="fa-spin fa-2x" style="line-height:20px; vertical-align: middle;"></span></div>' +
                      '<span ng-bind="loaderText"></span><span>...</span>' +
                    '</div>' +
                  '</div>' +
                '</div>',
      link: function(scope, element, attrs) {
        scope.dots = 3;
        scope.loaderBar = null;
        scope.loadMask = null;
        scope.loaderText = null;

        var timer = null;
        var addDots = function(){
          scope.dots += 1;
          if(scope.dots == 4) scope.dots = 0;
        };
        var clearTick = function(){
          if(timer) $interval.cancel(timer);
        };
        var startTick = function(){
          clearTick();
          if(!scope.loaderText) return;
          scope.loaderText.replace('\.','');
          if(scope.loaderText.substr(scope.loaderText.length - 3) == '...')
            scope.loaderText = scope.loaderText.substring(0, scope.loaderText.length - 3);
          addDots();
          timer = $interval(addDots, 600);
        };

        scope.start = function(options) {
          if(!options || _.isString(options)){
            // if just text was passed in... enable mask & load bar...
            scope.loaderText = options || 'Loading';
            scope.loadMask = true;
            scope.loaderBar = true;
          } else if(_.isPlainObject(options)){
            scope.loaderText = options.hasOwnProperty('text') ? options.text : '';
            scope.loadMask =   options.hasOwnProperty('mask') ? options.mask : scope.loaderText; // show mask if text
            scope.loaderBar =  options.hasOwnProperty('bar') ?  options.bar : true
          }
          startTick();
        };
        scope.stop = function() {
          scope.loaderBar = scope.loaderText = scope.loadMask = null;
          clearTick();
        };
        scope.$on(afEvent.EVENT_loaderStart, function(event, options) {
          scope.start(options);
        });
        scope.$on(afEvent.EVENT_loaderStop, scope.stop);

        // kill any timer on destroy
        element.on('$destroy', clearTick);
      }
    };
  });
;

angular.module('af.modal', ['af.event'])

  .constant('AF_MODAL_CONFIG', {
    genericModalPath:'src/views/templates/generic.modal.view.html'
  })

  .service("afModal", function(afEvent, AF_MODAL_CONFIG) {
    var service;
    service = {
      isOpen:false,
      url: null,
      controller: null,
      size:null,
      open: function(url, ctrl, size) {
        service.url = url;
        service.controller = ctrl;
        service.size = size; // lg, md, sm
        if (!service.url) service.url = AF_MODAL_CONFIG.genericModalPath;
        afEvent.shout("Modal.open", {
          url: service.url,
          controller: service.controller,
          size: service.size
        });
        service.isOpen = true;
      },
      close: function(data) {
        if(!service.isOpen) return;
        afEvent.shout("Modal.close", data);
        service.isOpen = false;
        service.url = null;
        service.size = null;
        service.controller = null;
      },
      message:function(title, body){
        var ctrl = { title:null, body:''};
        if(arguments.length == 1) {
          ctrl.body = title;
        } else {
          ctrl.title = title;
          ctrl.body = body;
        }
        service.open(AF_MODAL_CONFIG.genericModalPath, ctrl);
      }
    };
    return service;
  })

  .directive("modalHolder", function(afModal, $timeout, $window) {
    return {
      restrict: "A",
      scope: {},
      template: '<div id="modalHolder" class="ng-cloak" ng-show="modalURL">' +
                  '<div class="modal-backdrop fade" style="bottom:0; z-index: 1039;" ng-click="close()"></div>' +
                  '<div class="modal fade" ng-click="close()" style="display:block">' +
                    '<div class="modal-dialog" ng-click="stopClickThrough($event)" ' +
                      // ios hack for rendering issues
                      'style="-webkit-transition: -webkit-transform 0ms; -webkit-transform-origin: 0px 0px; -webkit-transform: translate3d(0px, 0px, 0px);" ' +
                      'ng-include="modalURL" ng-class="size"></div>' +
                    '<div class="iosModelScrollHack" ></div>' +
                  '</div>' +
                '</div>',
      link: function(scope, element, attrs) {
        scope.modalURL = afModal.url;
        scope.size = null;
        scope.close = function() {
          $('body').removeClass('modal-open');
          $("#modalHolder").children().removeClass("in");
          return scope.modalURL = null;
        };
        scope.$on("Modal.open", function() {
          scope.modalURL = afModal.url;
          scope.size = null;
          if(afModal.size){
            switch(afModal.size){
              case 'lg': scope.size = {'modal-lg':true}; break;
              case 'md': scope.size = {'modal-md':true}; break;
              case 'sm': scope.size = {'modal-sm':true}; break;
            }
          }
          $('body').addClass('modal-open');
          $timeout(function() {
            $("#modalHolder").children().addClass("in");
          }, 50);
        });

        scope.$on("Modal.close", scope.close);
        scope.stopClickThrough = function(event) {
          event.stopImmediatePropagation();
        };
      }
    };
  })

  .controller('GenericModalCtrl', function($scope, afModal) {

    /*
    Example usage
    afModal.open('client/views/analyzers/client.profitability.settings.php', {
      clickClose:() ->
        modalScope = afModal.getScope()
         * do something
        afModal.close()
    })
     */
    var defaultController, init;
    defaultController = {
      title: 'Are you sure?',
      body: 'Are you sure you wish to continue?',
      closeBtnLabel: 'Close',
      confirmBtnLabel: null,
      clickClose: function() {
        return afModal.close();
      },
      clickConfirm: function() {
        return afModal.close();
      },
      run: function() {
        var foo;
        return foo = 'override this';
      }
    };
    init = function() {
      _.extend($scope, defaultController, afModal.controller);
      //return afModal.updateModalScope($scope);
    };
    init();
    return $scope.run();
  });
;

angular.module('af.msg', ['af.event', '_'])

  .service('afMsg', function(afEvent) {
    var afMsg = null;
    return afMsg = {

      shownAt: null,
      minVisible: 3,

      show: function(message, type, options) {

        options = options || {};
        if (_.isNumber(options.delay) && options.delay < afMsg.minVisible)
          options.delay = afMsg.minVisible;

        afMsg.shownAt = new Date().getTime();

        return afEvent.shout(afEvent.EVENT_msgShow, {
          message: message,
          type:    type,
          options: options
        });
      },

      clear: function(force) {
        var now = new Date().getTime();
        if (force || (afMsg.shownAt && (now - afMsg.shownAt) > afMsg.minVisible))
          return afEvent.shout(afEvent.EVENT_msgClear);
      },

      alert:   function(message, options) { return afMsg.show(message, 'warning', options); },
      error:   function(message, options) { return afMsg.show(message, 'danger',  options); },
      danger:  function(message, options) { return afMsg.show(message, 'danger',  options); },
      info:    function(message, options) { return afMsg.show(message, 'info',    options); },
      success: function(message, options) { return afMsg.show(message, 'success', options); }
    };
  })


  .directive('msgHolder', function($timeout, $window, afEvent) {
    var timer = null;
    return {
      restrict: 'A',
      template: '<div id="app-alert" class="ng-cloak">' +
                  '<div class="app-alert-container container" ng-show="visible">' +
                    '<div class="alert" ng-class="cssClass">' +
                      '<button type="button" class="close" ng-show="!closable" ng-click="clear()">×</button>' +
                      '<span ng-bind-html="message"></span>' +
                    '</div>' +
                  '</div>' +
                '</div>',
      link: function(scope, element, attrs) {

        scope.message = null;
        scope.type = null;
        scope.closable = true;

        scope.visible = false;

        var showMessage = function(message, type, options) {

          var types = ['warning', 'danger', 'info', 'success'];
          if(!_.includes(types, type)) type = 'warning';

          scope.message = message;
          scope.closable = options.closable;
          scope.visible = true;

          scope.cssClass = 'alert-' + type;

          if(scope.delay)
            scope.cssClass += ' alert-dismissable';

          // clear after delay?
          if (timer)
            $timeout.cancel(timer);

          if(_.isNumber(options.delay) && options.delay > 0) {
            timer = $timeout(function() {
              scope.clear();
            }, options.delay * 1000);
          }
        };

        scope.clear = function() {
          scope.visible = false;
          if (timer) $timeout.cancel(timer);
        };

        scope.$on(afEvent.EVENT_msgShow, function(event, data) {
          showMessage(data.message, data.type, data.options);
        });

        scope.$on(afEvent.EVENT_msgClear, scope.clear);

      }
    };
  });

;
//
// SIMPLE WRAPPER AROUND AMPLIFY.STORE TO ALLOW NAME SPACING...
//
angular.module('af.storage', [])

  .constant('AF_STORAGE_CONFIG', {persistent_prefix:'myApp'} )

  .service('afStorage', function(AF_STORAGE_CONFIG, $log) {

    var prefix = AF_STORAGE_CONFIG.persistent_prefix;

    // determine if data belons to this app
    var isAppData = function(key){
      return key.indexOf(prefix+'_') === 0;
    };

    var storage = null;
    return storage = {

      // amplify wrapper
      amplify:function(key, value, options){
        if(_.isNumber(options)) options = { expires:options };
        return amplify.store(prefix+'_'+key, value, options);
      },

      // STORE
      store:function(key, value, options){
        return storage.amplify(key, value, options);
      },

      // CLEAR
      clear: function(key) {
        if(key) {
          // clear one thing
          storage.amplify(key, null);
        } else {
          // clear all app data
          _.keys(amplify.store(), function(key){
            if(isAppData(key))
              amplify.store(key, null);
          });
        }
      },

      // NUKE
      // clear everything (all amplify data
      nuke:function(){
        _.keys(amplify.store(), function(key){
          amplify.store(key, null);
        });
      }

    };
  });


;
//these are just references the instance of related lib so we can inject them to the controllers/services in an angular way.
angular.module('_', [])
  .factory('_', [ '$window',
    function ($window) { return $window._; }
  ]);
;
//these are just references the instance of related lib so we can inject them to the controllers/services in an angular way.
angular.module('amplify', [])
  .factory('amplify', [ '$window',
    function ($window) { return $window.amplify; }
  ]);
;
//these are just references the instance of related lib so we can inject them to the controllers/services in an angular way.
angular.module('jQuery', [])
  .factory('jQuery', [ '$window',
    function ($window) { return $window.jQuery; }
  ]);
;
//these are just references the instance of related lib so we can inject them to the controllers/services in an angular way.
angular.module('moment', [])
  .factory('moment', [ '$window',
    function ($window) { return $window.moment; }
  ]);
;

;

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
            request.headers = request.headers || {};
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
                if(err.indexOf('<?xml') == 0)
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
;
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

angular.module('af.util', [])
  .service('afUtil', function($window, $location) {

    var afUtil = null;
    return afUtil = {

      GET: function(key) {
        // quick check to see if key is even in url at all...
        if(key && $location.absUrl().indexOf(key) < 0) return null;

        var vars = $location.search();
        var search = $window.location.search;
        if (search) {
          var params = search.split('&');
          _.each(params, function(param, i) {
            var parts;
            parts = param.replace('#', '').replace('/', '').replace('?', '').split('=');
            return vars[parts[0]] = decodeURIComponent(parts[1]);
          });
        }
        if (key) {
          if (vars[key]) return vars[key];
          if (vars[key.toLowerCase()]) return vars[key.toLowerCase()];
          return null;
        }
        return vars;
      },

      postToUrl: function(url, params, newWindow, method) {
        var date, form, winName;
        if (!_.isBoolean(newWindow))
          newWindow = true;
        method = method || 'post';
        form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", url);
        _.each(params, function(value, key) {
          var hiddenField, type;
          type = typeof value;
          if (type === 'function' || type === 'object') {
            return;
          }
          hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", value);
          return form.appendChild(hiddenField);
        });
        if (newWindow) {
          date = new Date();
          winName = 'af_postWindow' + date.getTime();
          window.open('', winName);
          form.target = winName;
          document.body.appendChild(form);
          form.submit();
        } else {
          document.body.appendChild(form);
          form.submit();
        }
        return document.body.removeChild(form);
      },

      // creates a displayName for our user
      createDisplayName:function(user, preference){

        if(!user) return 'Unknown User';
        var fullName = function(user){
          if(user.firstName && user.lastName)
            return user.firstName + ' ' + user.lastName;
          return null;
        };

        if(preference && preference == 'nameOfPractice'){
          if(user.nameOfPractice) return user.nameOfPractice;
          if(fullName(user)) return fullName(user);
        } else {
          if(fullName(user)) return fullName(user);
          if(user.nameOfPractice) return user.nameOfPractice;
        }
        return user.name || user.firstName || user.lastName || user.username || 'User ' + user.userId;
      },

      protocolAndHost:function(){
        return $window.location.protocol+'//'+$window.location.host;
      },

      isTruthy:function(value){
        return (value === 'true' || value === true || value == '1' || value === 1)
      },

      number:{
        // floating point error fix
        nc:function(number, precision){ return afUtil.number.floatFix(number, precision); },
        floatFix:function(number, precision){
          var precision = precision || 2,
              correction = Math.pow(10, precision);
          return Math.round(correction * number)/correction;
        }
      },

      string: {
        nl2br: function (str) {
          if (!str || typeof str != 'string') return str;
          return str.replace(/\n\r?/g, '<br />');
        },
        // clean junk from a string to get the number out...
        getNumber:function(value){
          var negativeSign = (''+value).substr(0,1) === '-' ? '-':'';
          var pattern = /[^\.\d]/g,
              cleaned = (''+value).replace(pattern,'');
          return parseFloat(negativeSign + cleaned);
        }
      },

      format: {
        date: function(value, format, inputType) {
          if (!value) return '';
          if (!inputType) inputType = "utc";
          if (moment) {
            if(!format) format = appTenant.config('settings.dates.format') || 'MM/DD/YY';
            if (typeof value === 'string') {
              switch (inputType.toLowerCase()) {
                case 'utc':
                  inputType = "YYYY-MM-DDTHH:mm:ss ZZ";
                  break;
                case 'asp':
                  inputType = null;
              }
              return moment(value, inputType).format(format);
            } else {
              return moment(value).format(format);
            }
          }
          return value;
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
          showSymbol = afUtil.isTruthy(showSymbol);
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
          return afUtil.format.number(value, precision, 'currency', showSymbol);
        },
        percent: function(value, precision, showSymbol) {
          return afUtil.format.number(value, precision, 'percent', showSymbol);
        },
        targetValue:function(value, type, precision){
          switch((''+type).toLowerCase()){
            case 'hours':
            case 'number':    return afUtil.format.number(value, precision);
            case 'currency':  return afUtil.format.currency(value, precision);
            case 'percent':   return afUtil.format.percent(value, precision);
            case 'textarea':  return afUtil.string.nl2br(value);
            case 'text':      return value;
          }
          return value;
        }
      },

      unFormat:{
        percent:function(value, precision){
          return afUtil.unFormat.number(value, precision, 'percent');
        },
        currency:function(value, precision){
          return afUtil.unFormat.number(value, precision, 'currency');
        },
        number:function(value, precision, type){

          if(_.isNull(value) || _.isUndefined(value) || value === '') return null;

          // sanity checks
          if(!precision) precision = 0;
          if(!type) type = 'number'; // number or percent
          type = (''+type).toLowerCase();

          var showDecimal = precision > 0 ? true:false;
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
          if(type == 'percent') final = afUtil.number.floatFix(final / 100, precision+2);
          if(_.isNaN(final) || _.isUndefined(final)) return null;
          return final;
        }
      }

    };
  });
