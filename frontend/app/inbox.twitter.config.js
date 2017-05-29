(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter')
    .config(configBlock);

  function configBlock(dynamicDirectiveServiceProvider) {
    dynamicDirectiveServiceProvider.addInjection('inbox-sidebar', new dynamicDirectiveServiceProvider.DynamicDirective(true, 'inbox-twitter-sidebar-menu'));
  }

})();
