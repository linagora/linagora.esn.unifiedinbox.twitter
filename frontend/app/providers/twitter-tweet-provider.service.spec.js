'use strict';

/* global chai,  _ */

var expect = chai.expect;

function elements(id, length, offset) {
  var array = [], start = offset || 0;

  for (var i = start; i < (start + length); i++) {
    array.push({
      id: id + '_' + i,
      date: new Date(2016, 1, 1, 1, 1, 1, i), // The variable millisecond is what allows us to check ordering in the tests
      mailboxIds: ['id_inbox'],
      threadId: 'thread_' + i,
      hasAttachment: true
    });
  }

  return array;
}

describe('The inboxNewTwitterProvider factory', function() {
  var $rootScope, inboxNewTwitterProvider, $httpBackend;

  beforeEach(function() {
    module('linagora.esn.unifiedinbox.twitter', function($provide) {
      $provide.value('session', {});
      $provide.value('newProvider', _.identity);
      $provide.constant('ELEMENTS_PER_REQUEST', 200);
      $provide.constant('PROVIDER_TYPES', {});
    });
  });

  beforeEach(inject(function(_$rootScope_, _inboxNewTwitterProvider_, _$httpBackend_) {
    $rootScope = _$rootScope_;
    inboxNewTwitterProvider = _inboxNewTwitterProvider_;
    $httpBackend = _$httpBackend_;
  }));

  it('should paginate requests to the backend', function(done) {
      var fetcher = inboxNewTwitterProvider('id', 'myTwitterAccount', '/unifiedinbox/api/inbox/tweets').fetch();

      $httpBackend.expectGET('/unifiedinbox/api/inbox/tweets?account_id=myTwitterAccount&count=400').respond(200, elements('tweet', 200));

      fetcher();
      $httpBackend.flush();

      $httpBackend.expectGET('/unifiedinbox/api/inbox/tweets?account_id=myTwitterAccount&count=400&max_id=tweet_199').respond(200, [{
        id: 'tweet_200'
      }]);

      fetcher().then(function(tweets) {
        expect(tweets.length).to.equal(1);

        done();
      });
      $httpBackend.flush();
    });

    it('should support fetching recent items', function(done) {
      var fetcher = inboxNewTwitterProvider('id', 'myTwitterAccount', '/unifiedinbox/api/inbox/tweets').fetch();

      $httpBackend.expectGET('/unifiedinbox/api/inbox/tweets?account_id=myTwitterAccount&count=400').respond(200, elements('tweet', 200));

      fetcher();
      $httpBackend.flush();

      $httpBackend.expectGET('/unifiedinbox/api/inbox/tweets?account_id=myTwitterAccount&count=400&since_id=tweet_0').respond(200, [
        {
          id: 'tweet_-1'
        }
      ]);

      fetcher.loadRecentItems({ id: 'tweet_0' }).then(function(tweets) {
        expect(tweets.length).to.equal(1);

        done();
      });
      $httpBackend.flush();
    });

  describe('The buildFetchContext function', function() {

    var provider;

    beforeEach(function() {
      provider = inboxNewTwitterProvider('id', 'myTwitterAccount', '/unifiedinbox.twitter/twitter/tweets');
    });

    it('should resolve when no options are given', function(done) {
      provider.buildFetchContext().then(done);
      $rootScope.$digest();
    });

    it('should resolve when quickFilter is not defined', function(done) {
      provider.buildFetchContext({}).then(done);
      $rootScope.$digest();
    });

    it('should reject if quickFilter is defined', function(done) {
      provider.buildFetchContext({quickFilter: 'filter'}).catch(function() {
        done();
      });
      $rootScope.$digest();
    });
  });

  describe('The itemMatches function', function() {

  it('should resolve when no provider ID is selected', function(done) {
    var provider = inboxNewTwitterProvider('id', 'myTwitterAccount', '/unifiedinbox.twitter/twitter/tweets');

    provider.itemMatches({}, {}).then(done);
    $rootScope.$digest();
  });

  it('should resolve when provider ID matches selected provider ID', function(done) {
    var provider = inboxNewTwitterProvider('id', 'myTwitterAccount', '/unifiedinbox.twitter/twitter/tweets');

    provider.itemMatches({}, { acceptedIds: ['id'] }).then(done);
    $rootScope.$digest();
  });

  it('should reject when provider ID does not match selected provider ID', function(done) {
    var provider = inboxNewTwitterProvider('id', 'myTwitterAccount', '/unifiedinbox.twitter/twitter/tweets');

    provider.itemMatches({}, { acceptedIds: ['another_id'] }).catch(done);
    $rootScope.$digest();
  });

});

});
