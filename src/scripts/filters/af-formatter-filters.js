
angular.module('af.formatterFilters', ['af.appTenant', 'af.util'])

  .filter('formatNumber', function(afUtil) {
    return afUtil.format.number;
  })
  .filter('formatPercent', function(afUtil) {
    return afUtil.format.percent;
  })
  .filter('formatDate', function(afUtil) {
    return afUtil.format.date;
  })
  .filter('formatCurrency', function(afUtil) {
    return afUtil.format.currency;
  })
  .filter('formatTargetValue', function(afUtil) {
    return afUtil.format.targetValue;
  })