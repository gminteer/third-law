const router = require('express').Router();

module.exports = (services, {auth}) => {
  router.get('/login', auth.mustBeAnonymous, (req, res) => {
    return res.render('login-signup.pug');
  });

  router.get('/logout', async (req, res) => {
    if (!req.session.isLoggedIn) return res.redirect('/');
    await new Promise((resolve) => req.session.destroy(() => resolve(true)));
    return res.redirect('/');
  });

  router.get('/thoughts/:thoughtId', async (req, res, next) => {
    try {
      const thought = await services.thought.getThought(req.params.thoughtId);
      if (!thought) return res.redirect('/');
      return res.render('thought.pug', {session: req.session, thought});
    } catch (err) {
      next(err);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const thoughts = await services.thought.getThought();
      return res.render('index.pug', {session: req.session, thoughts});
    } catch (err) {
      next(err);
    }
  });

  return router;
};
