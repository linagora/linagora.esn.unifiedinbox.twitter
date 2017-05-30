'use strict';

const express = require('express');
const FRONTEND_PATH = require('./constants').FRONTEND_PATH;

module.exports = dependencies => {
  const application = express();

  require('./config/i18n')(dependencies, application);
  application.use(express.static(FRONTEND_PATH));
  require('./config/views')(dependencies, application);

  application.use(require('./twitter/router')(dependencies));

  return application;
};
