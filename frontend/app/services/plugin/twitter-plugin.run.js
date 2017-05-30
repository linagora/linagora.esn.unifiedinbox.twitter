(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox')

    .run(function($q, inboxPlugins, _, INBOX_TWITTER_TYPE, session) {
      inboxPlugins.add({
        type: INBOX_TWITTER_TYPE,
        contextSupportsAttachments: _.constant($q.when(false)),
        resolveContextName: function(account) {
          return $q.when('@' + _.find(session.getProviderAccounts(INBOX_TWITTER_TYPE), { id: account }).username);
        },
        getEmptyContextTemplateUrl: _.constant($q.when('/unifiedinbox.twitter/app/services/plugin/twitter-plugin-empty-message.html'))
      });
    });

})();
