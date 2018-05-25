(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter')
    .factory('inboxNewTwitterProvider', function($q, $http, newProvider, _, ELEMENTS_PER_REQUEST, PROVIDER_TYPES, INBOX_TWITTER_TYPE) {
      return function(id, accountId, url) {
        return newProvider({
          id: id,
          account: accountId,
          types: [PROVIDER_TYPES.SOCIAL, INBOX_TWITTER_TYPE],
          name: 'Tweets',
          fetch: function() {
            var oldestTweetId = null,
                fetcher = function(mostRecentTweetId) {
                  return $http
                    .get(url, {
                      params: {
                        account_id: accountId,
                        count: ELEMENTS_PER_REQUEST * 2, // Because count may not be what you think -> https://dev.twitter.com/rest/reference/get/statuses/mentions_timeline
                        max_id: mostRecentTweetId ? null : oldestTweetId,
                        since_id: mostRecentTweetId
                      }
                    })
                    .then(_.property('data'))
                    .then(function(results) {
                      if (results.length > 0) {
                        oldestTweetId = _.last(results).id;
                      }

                      return results;
                    });
                };

            fetcher.loadRecentItems = function(mostRecentTweet) {
              return fetcher(mostRecentTweet.id);
            };

            return fetcher;
          },
          buildFetchContext: function(options) {
            return options && options.quickFilter ? $q.reject('Twitter does not support server-side filtering') : $q.when();
          },
          templateUrl: '/unifiedinbox.twitter/app/providers/twitter-tweet-provider',
          options: {
            itemMatches: function(item, filters) {
              return $q(function(resolve, reject) {
                if (!filters.acceptedIds) {
                  return resolve();
                }

                _.contains(filters.acceptedIds, id) ? resolve() : reject();
              });
            }
          }
        });
      };
    })

    .factory('inboxTwitterMentionsProvider', function(inboxNewTwitterProvider) {
      return function(accountId) {
        return inboxNewTwitterProvider('inboxTwitterMentions', accountId, '/unifiedinbox.twitter/twitter/mentions');
      };
    })

    .factory('inboxTwitterDirectMessagesProvider', function(inboxNewTwitterProvider) {
      return function(accountId) {
        return inboxNewTwitterProvider('inboxTwitterDirectMessages', accountId, '/unifiedinbox.twitter/twitter/directmessages');
      };
    });

})();
