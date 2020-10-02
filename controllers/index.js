const router = require('express').Router();

module.exports = (services, middleware) => {
  router.use('/api', require('./api')(services, middleware));
  router.use('/', require('./html')(services, middleware));
  return router;
};
