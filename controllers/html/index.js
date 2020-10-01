const router = require('express').Router();

module.exports = (services) => {
  // TODO
  router.get('/', (req, res) => {
    console.log(req.session);
    return res.render('index.pug');
  });

  return router;
};
