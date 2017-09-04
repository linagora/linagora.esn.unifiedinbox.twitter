(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter')
    .component('inboxTwitterListItem', {
      bindings: {
        item: '<',
        account: '<'
      },
      templateUrl: '/unifiedinbox.twitter/app/components/list/twitter-list-item.html'
  });

})();
