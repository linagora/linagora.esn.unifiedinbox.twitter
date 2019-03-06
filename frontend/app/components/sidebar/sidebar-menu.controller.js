(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter')
    .controller('inboxTwitterSidebarMenuController', function($rootScope, session, inboxConfig, INBOX_TWITTER_CONFIG_TWEETS, INBOX_TWITTER_TYPE, INBOX_EVENTS) {
      var self = this;

      self.$onInit = $onInit;
      self.$onDestroy = $onDestroy;

      function $onInit() {
        inboxConfig(INBOX_TWITTER_CONFIG_TWEETS).then(function(enabled) {
          self.accounts = session.getProviderAccounts(INBOX_TWITTER_TYPE);
          self.isEnabled = enabled;
        });
      }

      var removeStateListener = $rootScope.$on(INBOX_EVENTS.FILTER_SOCIAL_CHANGED, function(evt, data) {
        if (data.type === INBOX_TWITTER_TYPE) {
          self.isEnabled = data.enable;
        }
      });

      function $onDestroy() {
        removeStateListener();
      }
    });

})();
