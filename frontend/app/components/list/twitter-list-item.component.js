(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter')
    .component('inboxTweetListItem', {
      bindings: {
        item: '<'
      },
      templateUrl: '/unifiedinbox.twitter/app/components/list/twitter-list-item.html'
  });

})();
