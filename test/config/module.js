'use strict';

/* global _: false */

angular.module('esn.header', []);
angular.module('linagora.esn.unifiedinbox', [])
  .constant('_', _)
  .constant('inboxPlugins', {
    add: angular.noop
  })
  .constant('inboxFilters', { add: angular.noop })
  .constant('INBOX_EVENTS', {FILTER_SOCIAL_CHANGED: 'inbox:filterSocialChanged'});
