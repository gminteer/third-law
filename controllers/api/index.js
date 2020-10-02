const router = require('express').Router();

module.exports = (services, middleware) => {
  router.use('/users', require('./user')(services, middleware));
  router.use('/thoughts', require('./thought')(services, middleware));
  router.use('/session', require('./session')(services, middleware));
  router.use(require('./error-handler'));
  return router;
};
