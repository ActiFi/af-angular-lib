
angular.module('af.formatterFilters', ['af.formatUtil'])

  .filter('formatNumber', function(afFormatUtil) {
    return afFormatUtil.format.number;
  })
  .filter('formatPercent', function(afFormatUtil) {
    return afFormatUtil.format.percent;
  })
  .filter('formatDate', function(afFormatUtil) {
    return afFormatUtil.format.date;
  })
  .filter('formatCurrency', function(afFormatUtil) {
    return afFormatUtil.format.currency;
  })
  .filter('formatTargetValue', function(afFormatUtil) {
    return afFormatUtil.format.targetValue;
  })