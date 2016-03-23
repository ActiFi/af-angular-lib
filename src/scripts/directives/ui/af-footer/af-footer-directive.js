angular.module('af.footer', ['af.tenant'])


  .directive('afFooter',  function(afTenant) {
    return {
      restrict: "A",
      replace:true,
      scope:{
        afFooter:'@'
      },
      template:'<div id="af-footer" class="hidden"></div>',
      compile:function(elm, attrs){
        var content = afTenant.config(attrs['af-footer']);
        if(content)
          angular.element(elm).html(hidden).removeClass('hidden');
      }
    };
  });