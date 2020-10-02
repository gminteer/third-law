const router = require('express').Router();

module.exports = (services, {auth}) => {
  // Get all users or get one user by identifier
  router.get(['/', '/:_id', '/name/:username', '/email/:email'], async (req, res, next) => {
    try {
      const options = {};
      Object.values(req.params).forEach((param) => {
        if (param) {
          options.includeFriends = true;
          options.includeThoughts = true;
        }
      });
      const user = await services.user.get(req.params, options);
      return res.json(user);
    } catch (err) {
      next(err);
    }
  });

  // Create a user
  router.post('/', async (req, res, next) => {
    try {
      const user = await services.user.create(req.body);
      req.session.isLoggedIn = true;
      req.session.userId = user._id.toHexString();
      return res.status(201).append('Location', user._id).json(user);
    } catch (err) {
      next(err);
    }
  });

  // Update a user by ID
  /**
   * @deprecated use session endpoint
   */
  router.put('/:userId', auth.mustBeOwner, async (req, res, next) => {
    try {
      const user = await services.user.update(req.params.userId, req.body);
      return res.json({message: 'Update successful', user});
    } catch (err) {
      next(err);
    }
  });

  // Delete a user by ID
  /**
   * @deprecated use session endpoint
   */
  router.delete('/:userId', auth.mustBeOwner, async (req, res, next) => {
    try {
      const user = await services.user.delete(req.params.userId);
      return res.json({message: 'Delete successful', user});
    } catch (err) {
      next(err);
    }
  });

  // Add a friend by user IDs
  /**
   * @deprecated use session endpoint
   */
  router.post('/:userId/friends/:friendId', auth.mustBeOwner, async (req, res, next) => {
    try {
      const {operation, user} = await services.user.toggleFriend(
        req.params.userId,
        {_id: req.params.friendId},
        {forceOperation: 'add'}
      );
      return res.json({message: `Friend ${operation}`, user});
    } catch (err) {
      next(err);
    }
  });

  // Remove a friend by user IDs
  /**
   * @deprecated use session endpoint
   */
  router.delete('/:userId/friends/:friendId', auth.mustBeOwner, async (req, res, next) => {
    try {
      const {operation, user} = await services.user.toggleFriend(
        req.params.userId,
        {_id: req.params.friendId},
        {forceOperation: 'remove'}
      );
      return res.json({message: `Friend ${operation}`, user});
    } catch (err) {
      next(err);
    }
  });

  return router;
};
