const express = require('express');
const cors = require('cors');

module.exports = dependencies => {
  const router = express.Router(),
        auth = dependencies('authorizationMW'),
        controller = require('./controller')(dependencies),
        middleware = require('./middleware')(dependencies);

  router.all('/twitter/*', cors({ origin: true, credentials: true }));

  router.get('/twitter/directmessages', auth.requiresAPILogin, middleware.getAccount, controller.getDirectMessages);
  router.get('/twitter/mentions', auth.requiresAPILogin, middleware.getAccount, controller.getMentions);

  return router;
};
