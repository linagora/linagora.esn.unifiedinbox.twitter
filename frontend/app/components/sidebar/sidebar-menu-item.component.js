(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter')
    .component('inboxTwitterSidebarMenuItem', {
      bindings: {
        account: '<'
      },
      templateUrl: '/unifiedinbox.twitter/app/components/sidebar/sidebar-menu-item.html'
    });

})();
