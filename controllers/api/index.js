const router = require('express').Router();

module.exports = (services) => {
  router.use('/users', require('./user')(services));
  router.use('/thoughts', require('./thought')(services));
  // Common API route error handler
  router.use(require('./error-handler'));
  return router;
};
