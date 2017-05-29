(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter')
    .controller('inboxTwitterSidebarMenuController', function(session, inboxConfig, INBOX_TWITTER_CONFIG_TWEETS, INBOX_TWITTER_TYPE) {
      var self = this;

      self.$onInit = $onInit;

      function $onInit() {
        inboxConfig(INBOX_TWITTER_CONFIG_TWEETS).then(function(enabled) {
          self.accounts = enabled ? session.getProviderAccounts(INBOX_TWITTER_TYPE) : [];
        });
      }
    });

})();
