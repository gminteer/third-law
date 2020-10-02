const router = require('express').Router();

module.exports = (services, {auth}) => {
  router.post('/login', auth.mustBeAnonymous, async (req, res, next) => {
    try {
      const {username, password} = req.body;
      const user = await services.user.checkPassword(username, password);
      if (!user) return res.status(400).json({message: 'Invalid login'});
      req.session.isLoggedIn = true;
      req.session.userId = user._id.toHexString();
      return res.json({
        message: 'Login successful',
        user,
      });
    } catch (err) {
      next(err);
    }
  });

  router.use(auth.mustBeLoggedIn); // Everything except for login requires a logged in session

  router.get('/logout', async (req, res) => {
    await new Promise((resolve) => req.session.destroy(() => resolve(true)));
    return res.json({message: 'Logout successful'});
  });

  router.get('/friends', async (req, res, next) => {
    try {
      const user = await services.user.get({_id: req.session.userId}, {includeFriends: true});
      return res.json(user.friends);
    } catch (err) {
      next(err);
    }
  });

  router.put('/friends', async (req, res, next) => {
    try {
      const {_id, username, email} = req.body;
      const result = await services.user.toggleFriend(req.session.userId, {_id, username, email});
      return res.json(result);
    } catch (err) {
      next(err);
    }
  });

  return router;
};
