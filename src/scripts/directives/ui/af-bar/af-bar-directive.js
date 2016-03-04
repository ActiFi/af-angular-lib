angular.module('af.bar', [])
  .directive("afBar", function() {
    return {
      restrict: "A",
      replace:true,
      template:
        '<div id="af-bar">'+
          '<a class="af-bar-logo-link" href="http://www.actifi.com" target="_blank">'+
            '<div class="af-bar-logo"></div>'+
          '</a>'+
          '<span class="af-bar-title">'+
          '<span>SUCCESS</span><span>PR</span><span style="letter-spacing:0;">O</span></span>'+
          '<div class="af-bar-poweredBy">' +
            '<a href="http://www.actifi.com" target="_blank">Powered By ActiFi</a>' +
          '</div>'+
        '</div>'
    };
  });