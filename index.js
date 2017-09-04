'use strict';

const AwesomeModule = require('awesome-module');
const Dependency = AwesomeModule.AwesomeModuleDependency;
const path = require('path');
const glob = require('glob-all');
const _ = require('lodash');

const NAME = 'unifiedinbox.twitter';
const APP_ENTRY_POINT = 'inbox.twitter.app.js';
const MODULE_NAME = 'linagora.esn.' + NAME;
const FRONTEND_JS_PATH = __dirname + '/frontend/app/';

const twitterModule = new AwesomeModule(MODULE_NAME, {
  dependencies: [
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.logger', 'logger'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.auth', 'auth'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.pubsub', 'pubsub'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.wrapper', 'webserver-wrapper'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.esn-config', 'esn-config'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.middleware.authorization', 'authorizationMW'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.webserver.denormalize.user', 'denormalizeUser'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.user', 'user'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.i18n', 'i18n'),
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.unifiedinbox', 'unifiedinbox')
  ],
  states: {
    deploy: function(dependencies, callback) {
      const webserverWrapper = dependencies('webserver-wrapper');
      const app = require('./backend/webserver/application')(dependencies);
      const lessFile = path.resolve(__dirname, './frontend/app/inbox.twitter.less');
      const configRegistry = dependencies('esn-config').registry;

      let frontendModules = glob.sync([
        FRONTEND_JS_PATH + '**/!(*spec).js'
      ]).map(filepath => filepath.replace(FRONTEND_JS_PATH, ''));

      _.pull(frontendModules, APP_ENTRY_POINT);
      frontendModules = [APP_ENTRY_POINT].concat(frontendModules);

      webserverWrapper.injectAngularAppModules(NAME, frontendModules, MODULE_NAME, ['esn']);
      webserverWrapper.injectLess(NAME, [lessFile], 'esn');
      webserverWrapper.addApp(NAME, app);
      configRegistry.registerToModule('linagora.esn.unifiedinbox', 'twitter.tweets', {});

      callback();
    }
  }
});

module.exports = twitterModule;
