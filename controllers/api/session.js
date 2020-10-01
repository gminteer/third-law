const router = require('express').Router();

module.exports = (services) => {
  router.post('/login', async (req, res, next) => {
    try {
      const {username, password} = req.body;
      const user = await services.user.checkPassword(username, password);
      if (!user) return res.status(400).json({message: 'Invalid login'});
      req.session.isLoggedIn = true;
      req.session.user = user;
      return res.json({
        message: 'Login successful',
        user,
      });
    } catch (err) {
      next(err);
    }
  });

  router.get('/logout', async (req, res) => {
    await new Promise((resolve) => req.session.destroy(() => resolve(true)));
    return res.json({message: 'Logout successful'});
  });
  return router;
};
