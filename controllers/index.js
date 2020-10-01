const router = require('express').Router();

module.exports = (services, errors) => {
  router.use('/api', require('./api')(services, errors));

  return router;
};
