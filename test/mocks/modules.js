'use strict';

angular.module('ngTagsInput', []);
angular.module('esn.i18n', [])
  .factory('esnI18nService', function() {
    return {
      translate: function(input) {
        return {
          text: input,
          toString: function() { return input; }
        };
      },
      isI18nString: function() { return true; }
    };
  })
  .filter('esnI18n', function() {
    return function(input) { return input; };
  });
