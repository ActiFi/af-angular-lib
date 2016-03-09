
// calling screenManager.isXS() will tell you if its xs screen
// determine/grab screen-sizes ... eg.. $('#xs-visible').is(":visible") -->

angular.module('af.screenManager', ['$'])

    .service("afScreenManager", function($) {

      // add div to dom that hide/show with different screen sizes via css.
      var media = '<div id="mq-xs-visible" class="visible-xs" style="width:1px; height: 1px;"></div>'+
                  '<div id="mq-sm-visible" class="visible-sm" style="width:1px; height: 1px;"></div>'+
                  '<div id="mq-md-visible" class="visible-md" style="width:1px; height: 1px;"></div>'+
                  '<div id="mq-lg-visible" class="visible-lg" style="width:1px; height: 1px;"></div>'+
                  '<div id="mq-is-retina" style="width:1px; height:1px;"></div>';
      // retina css
      var retinaCSS =
        '#mq-is-retina { display:none; }' +
        '@media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min--moz-device-pixel-ratio: 2), only screen and (-o-min-device-pixel-ratio: 2/1), only screen and (min-device-pixel-ratio: 2), only screen and (min-resolution: 192dpi), only screen and (min-resolution: 2dppx) {'+
          '#mq-is-retina { display:block; }' +
        '}';

      $('body').append(media);
      $('head').append("<style id='screenManagerDirectiveCSS' type='text/css'>"+retinaCSS+"</style>");

      var $xs =  $('#mq-xs-visible');
      var $sm =  $('#mq-sm-visible');
      var $md =  $('#mq-md-visible');
      var $lg =  $('#mq-lg-visible');
      var $ret = $('#mq-is-retina');

      return {
        isXS:function(){      return  $xs.is(":visible");  },
        isSM:function(){      return  $sm.is(":visible");  },
        isMD:function(){      return  $md.is(":visible");  },
        isLS:function(){      return  $lg.is(":visible");  },
        isRetina :function(){ return  $ret.is(":visible"); }
      };
    });