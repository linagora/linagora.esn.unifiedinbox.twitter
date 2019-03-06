(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter')

    .controller('inboxTwitterConfigurationSocialNetworksController', function(
      $q,
      $rootScope,
      inboxSelectionService,
      inboxFilteredList,
      esnUserConfigurationService,
      session,
      inboxProviders,
      inboxTwitterMentionsProvider,
      inboxTwitterDirectMessagesProvider,
      INBOX_TWITTER_CONFIG_TWEETS,
      INBOX_MODULE_METADATA,
      INBOX_EVENTS,
      INBOX_TWITTER_TYPE
      ) {
      var self = this;

      self.$onInit = $onInit;
      self.onSave = onSave;
      self.isTwitterEnabled = false;
      self.isTwitterdisplayed = false;

      /////

      function $onInit() {
        if (session.getProviderAccounts(INBOX_TWITTER_TYPE).length > 0) {
          self.isTwitterdisplayed = true;
          esnUserConfigurationService.get([INBOX_TWITTER_CONFIG_TWEETS], INBOX_MODULE_METADATA.id).then(function(isTwitterEnabled) {
            if (isTwitterEnabled && isTwitterEnabled.length) {
              self.isTwitterEnabled = isTwitterEnabled[0].value;
            }
          });
        }
      }

      function onSave() {
        esnUserConfigurationService.set([{ name: INBOX_TWITTER_CONFIG_TWEETS, value: self.isTwitterEnabled }], INBOX_MODULE_METADATA.id);
        if (self.isTwitterEnabled === true) {
          session.getProviderAccounts(INBOX_TWITTER_TYPE).forEach(function(account) {
            inboxProviders.add(inboxTwitterMentionsProvider(account.id));
            inboxProviders.add(inboxTwitterDirectMessagesProvider(account.id));
          });
          $rootScope.$broadcast(INBOX_EVENTS.FILTER_SOCIAL_CHANGED, { type: INBOX_TWITTER_TYPE, enable: self.isTwitterEnabled });
        } else if (self.isTwitterEnabled === false) {
          $q.all([
            inboxProviders.remove(function(provider) { return provider.id === 'inboxTwitterMentions'; }),
            inboxProviders.remove(function(provider) { return provider.id === 'inboxTwitterDirectMessages'; })
          ]).then(function() {
            inboxSelectionService.unselectAllItems();
            inboxFilteredList.reset();
            $rootScope.$broadcast(INBOX_EVENTS.FILTER_SOCIAL_CHANGED, { type: INBOX_TWITTER_TYPE, enable: self.isTwitterEnabled });
          });
        }
      }

    });

})();
