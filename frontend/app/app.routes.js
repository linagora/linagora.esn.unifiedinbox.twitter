(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter')
    .config(function($stateProvider) {
    $stateProvider
    .state('unifiedinbox.tweetview', {
      url: '/tweet?tweetId&type&account',
      views: {
        'main@unifiedinbox': {
          template: function($stateParams) {
            return '<tweet-element-view tweet="' + $stateParams.tweetId + '"></tweet-element-view>';
          }
        }
      }
    });
  });

})();
