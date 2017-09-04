(function() {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter')
    .component('tweetElementView', {
      bindings: {
        tweet: '@'
      },
      templateUrl: '/unifiedinbox.twitter/app/view/tweet.html'
  });

})();
