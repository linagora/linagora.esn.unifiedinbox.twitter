(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter')
    .component('inboxListItemContent', {
      bindings: {
        item: '<'
      },
      controller: 'inboxListTwitterItemContentController',
      templateUrl: '/unifiedinbox.twitter/app/components/list/inbox-list-item-content/inbox-list-item-content.html'
  });

})();
