'use strict';

/* global _: false */

angular.module('linagora.esn.unifiedinbox', [])
  .constant('_', _)
  .constant('inboxPlugins', {
    add: angular.noop
  });
