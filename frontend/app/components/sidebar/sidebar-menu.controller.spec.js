'use strict';

/* global chai, sinon */

var expect = chai.expect;

describe('The inboxTwitterSidebarMenuController controller', function() {

  var inboxConfig, session, enabled, scope, $rootScope, $q, $controller, INBOX_TWITTER_TYPE, INBOX_TWITTER_CONFIG_TWEETS;

  beforeEach(function() {
    session = {
      getProviderAccounts: sinon.spy(),
      ready: { then: function() {}}
    };

    enabled = true;

    inboxConfig = sinon.spy(function() {
      return $q.when(enabled);
    });
  });

  beforeEach(function() {
    module('linagora.esn.unifiedinbox.twitter', function($provide) {
      $provide.value('session', session);
      $provide.value('inboxConfig', inboxConfig);
    });
  });

  beforeEach(angular.mock.inject(function(_$rootScope_, _$controller_, _$q_, _INBOX_TWITTER_TYPE_, _INBOX_TWITTER_CONFIG_TWEETS_) {
    $rootScope = _$rootScope_;
    scope = $rootScope.$new();
    $controller = _$controller_;
    $q = _$q_;
    INBOX_TWITTER_TYPE = _INBOX_TWITTER_TYPE_;
    INBOX_TWITTER_CONFIG_TWEETS = _INBOX_TWITTER_CONFIG_TWEETS_;
  }));

  function getNewController(locals) {
    var controller = $controller('inboxTwitterSidebarMenuController', {$scope: scope}, locals);

    scope.$digest();

    return controller;
  }

  describe('The $onInit function', function() {
    it('should not set accounts if twitter.tweets is not enabled', function() {
      var controller = getNewController();

      session.getProviderAccounts = sinon.spy();
      enabled = false;

      controller.$onInit();
      $rootScope.$digest();

      expect(controller.accounts).to.deep.equal([]);
      expect(session.getProviderAccounts).to.not.have.been.called;
      expect(inboxConfig).to.have.been.calledWith(INBOX_TWITTER_CONFIG_TWEETS);
    });

    it('should set accounts from session', function() {
      var accounts = [{id: '1'}, {id: '2'}];
      var controller = getNewController();

      session.getProviderAccounts = sinon.spy(function() {
        return accounts;
      });

      controller.$onInit();
      $rootScope.$digest();

      expect(controller.accounts).to.deep.equal(accounts);
      expect(session.getProviderAccounts).to.have.been.calledWith(INBOX_TWITTER_TYPE);
      expect(inboxConfig).to.have.been.calledWith(INBOX_TWITTER_CONFIG_TWEETS);
    });
  });
});
