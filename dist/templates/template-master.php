<?php
  // ensure template engine is loaded
  require_once dirname(__FILE__) . '/phpti/ti.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/tenant/tenantContent.php';
?>
<!DOCTYPE html>
<html lang="en" ng-app="myApp">
<head>

  <?php startblock('head'); ?>
    <title></title>

    <meta charset="UTF-8">
    <!-- Always force latest IE rendering engine (even in intranet) & Chrome Frame -->
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible">
    <!-- english character set -->
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!-- ipad and device junk -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">


    <!-- ICONS -->
    <link href="/tenant/<?php echo TENANT_HASH; ?>/images/<?php echo TENANT_HASH; ?>_favicon.ico" type="image/x-icon" rel="shortcut icon" />
    <link href="/tenant/af-lib/img/actifi/apple-touch-icon.png" rel="apple-touch-icon"  />

    <!-- CSS - AF-LIB -->
    <link rel="stylesheet"    type="text/css"     href="/tenant/af-lib/css/af-init.css" />
    <link rel="stylesheet"    type="text/css"     href="/tenant/af-lib/css/af-lib.css" />
    <!-- CSS - TENANT THEME -->
    <link rel="stylesheet"    type="text/css"     href="/tenant/af-lib/css/theme-<?php echo appContent('app','theme'); ?>.css" />
    <link rel="stylesheet"    type="text/css"     href="/tenant/<?php echo TENANT_HASH; ?>/css/<?php echo TENANT_HASH; ?>_styles.css" />


    <!-- OLD BROWSER -->
    <!--[if IE 9]><script type="text/javascript">window.ie = 9;</script><![endif]-->
    <!--[if lt IE 9]>
      <script type="text/javascript">
        window.location.href = 'invalid-browser.php?min=9&redirect='+encodeURIComponent(window.location.href);
      </script>
    <![endif]-->

  <?php endblock('head'); ?>
</head>

<body <?php emptyblock('bodyTag'); ?>>

  <!-- this displays before angular has run/loaded -->
  <?php require_once dirname(__FILE__).'/application-loader.html'; ?>

  <?php emptyblock('body'); ?>

  <!-- angular default messages -->
  <?php require_once dirname(__FILE__).'/default-messages.html'; ?>

  <!-- scripts -->
  <?php startblock('js'); ?>
    <?php
      generateServerEnvJs();                    // window.server = {ENV, TENANT_HASH, TENANT_INDEX ... } (afEnv)
      generateTenantContentJs('window.config'); // window.config = tenant labels, settings, etc (afTenant)
    ?>
  <?php endblock('js'); ?>

</body>
</html>