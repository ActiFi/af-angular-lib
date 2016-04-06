// usage
// ngApp.config(function($locationProvider, afFooterConfigProvider) {
  //afFooterConfigProvider.content = afTenant.config('somecontent');
//}
angular.module('af.footer', [])

  .provider('afFooterConfig', function(){
    this.content = '[[FOOTER]]';
    this.$get = function () { return this; };
  })

  .directive('afFooter',  function(afFooterConfig) {
    return {
      restrict: "A",
      replace:true,
      scope:{
        afFooter:'@'
      },
      template:'<div id="af-footer" class="hidden"></div>',
      compile:function(elm, attrs){
        var content = afFooterConfig.content;
        if(content)
          angular.element(elm).html(hidden).removeClass('hidden');
      }
    };
  });