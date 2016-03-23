
angular.module('af.util', ['af.apiUtil', 'af.formatUtil', 'af.locationUtil', 'af.timeoutUtil'])
  .service('afUtil', function(afApiUtil, afFormatUtil, afLocationUtil, afTimeoutUtil) {

    var afUtil = null;
    return afUtil = {

      api:afApiUtil,

      location:afLocationUtil,

      format:afFormatUtil.format,
      unFormat:afFormatUtil.unFormat,

      timeout:afTimeoutUtil.timeout,
      interval:afTimeoutUtil.interval,

      isTruthy:function(value){
        return (value === 'true' || value === true || value == '1' || value === 1)
      }

    };
  });
