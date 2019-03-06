(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter')
    .run(function(inboxConfig, inboxProviders, inboxTwitterDirectMessagesProvider, inboxTwitterMentionsProvider, session, INBOX_TWITTER_CONFIG_TWEETS, INBOX_TWITTER_TYPE) {

      inboxConfig(INBOX_TWITTER_CONFIG_TWEETS).then(function(twitterTweetsEnabled) {
        if (twitterTweetsEnabled) {
          session.getProviderAccounts(INBOX_TWITTER_TYPE).forEach(function(account) {
            inboxProviders.add(inboxTwitterMentionsProvider(account.id));
            inboxProviders.add(inboxTwitterDirectMessagesProvider(account.id));
          });
        }
      });

  });

})();
