(function(angular) {
  'use strict';

  angular.module('linagora.esn.unifiedinbox.twitter').controller('inboxListTwitterItemContentController', inboxListTwitterItemContentController);

  function inboxListTwitterItemContentController() {
    var self = this;

    self.$onInit = $onInit;

    function $onInit() {
      if (self.item.type === 'tweet') {
        self.twitterURL = 'https://twitter.com/' + self.item.author.screenName + '/status/' + self.item.id;
      } else if (self.item.type === 'directMessage') {
        self.twitterURL = 'https://twitter.com/messages/compose?recipient_id=' + (self.item.sentbyme ? self.item.rcpt.id : self.item.author.id);
      }
    }
  }

})(angular);
