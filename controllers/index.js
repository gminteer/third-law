const router = require('express').Router();

module.exports = (services) => {
  router.use('/api', require('./api')(services));

  return router;
};
