(function(angular) {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter').run(inboxTwitterPlugin);

  function inboxTwitterPlugin($q, inboxFilters, inboxPlugins, _, INBOX_TWITTER_TYPE, session) {
    inboxPlugins.add({
      type: INBOX_TWITTER_TYPE,
      contextSupportsAttachments: _.constant($q.when(false)),
      resolveContextName: function(account) {
        return $q.when('@' + _.find(session.getProviderAccounts(INBOX_TWITTER_TYPE), { id: account }).username);
      },
      getEmptyContextTemplateUrl: _.constant($q.when('/unifiedinbox.twitter/app/services/plugin/twitter-plugin-empty-message.html'))
    });
        inboxFilters.add([{
        id: 'inboxTwitterMentions',
        displayName: 'Mentions',
        type: INBOX_TWITTER_TYPE,
        selectionById: true
      },
      {
        id: 'inboxTwitterDirectMessages',
        displayName: 'Direct Messages',
        type: INBOX_TWITTER_TYPE,
        selectionById: true
      }
    ]);
  }

})(angular);
