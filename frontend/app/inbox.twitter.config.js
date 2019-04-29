(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter')
    .config(function(dynamicDirectiveServiceProvider) {
    dynamicDirectiveServiceProvider.addInjection('inbox-sidebar-social-networks-item', new dynamicDirectiveServiceProvider.DynamicDirective(true, 'inbox-twitter-sidebar-menu'));
    dynamicDirectiveServiceProvider.addInjection('inbox-configuration-social-networks-item', new dynamicDirectiveServiceProvider.DynamicDirective(true, 'inbox-twitter-configuration-social-networks'));
  });

})();
