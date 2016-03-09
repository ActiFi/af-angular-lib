// Makes hiding showing of form messages easier
// EXAMPLE :

// ctrl.showIfInvalid = formMessenger.showIfInvalid;

//<form name="ctrl.form">
//  <div class="alert alert-danger alert-sm"
//       ng-if="ctrl.showIfInvalid(ctrl.form, 'vPassword')"   // <-- hide/show message
//       ng-messages="ctrl.form.vPassword.$error">            // <-- defines the message
//    <!-- af default messages -->
//    <div ng-messages-include="form-messages"></div>
//    <!-- custom messages for this field-->
//    <div ng-message="match">Fields do not match. You must type in your new password twice.</div>
//  </div>
//</form>
angular.module('af.formMessenger', [])
  .service('formMessenger', function() {
    var formMessenger = null;
    return formMessenger = {
      showIfInvalid:function(form, field) {
        if(!form) return false;
        return (form[field].$dirty && form[field].$invalid) ||
               (form.$submitted && form[field].$invalid);
      }
    };
  });

