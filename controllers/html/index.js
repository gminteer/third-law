const router = require('express').Router();

module.exports = (services) => {
  // TODO
  router.get('/', (req, res) => {
    return res.render('index.pug');
  });

  return router;
};
