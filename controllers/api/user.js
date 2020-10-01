const router = require('express').Router();

module.exports = (services) => {
  // Get all users
  router.get('/', async (req, res, next) => {
    try {
      const users = await services.user.getAll();
      return res.json(users);
    } catch (err) {
      next(err);
    }
  });

  // Create a user
  router.post('/', async (req, res, next) => {
    try {
      const user = await services.user.create(req.body);
      return res.status(201).append('Location', user._id).json(user);
    } catch (err) {
      next(err);
    }
  });

  // Get a user by ID
  router.get('/:userId', async (req, res, next) => {
    try {
      const user = await services.user.getById(req.params.userId);
      return res.json(user);
    } catch (err) {
      next(err);
    }
  });

  // Update a user by ID
  router.put('/:userId', async (req, res, next) => {
    try {
      const user = await services.user.update(req.params.userId, req.body);
      return res.json({message: 'Update successful', user});
    } catch (err) {
      next(err);
    }
  });

  // Delete a user by ID
  router.delete('/:userId', async (req, res, next) => {
    try {
      const user = await services.user.delete(req.params.userId);
      return res.json({message: 'Delete successful', user});
    } catch (err) {
      next(err);
    }
  });

  // Add a friend by user IDs
  router.post('/:userId/friends/:friendId', async (req, res, next) => {
    try {
      const user = await services.user.addFriend(req.params.userId, req.params.friendId);
      return res.json({message: 'Friend added', user});
    } catch (err) {
      next(err);
    }
  });

  // Remove a friend by user IDs
  router.delete('/:userId/friends/:friendId', async (req, res, next) => {
    try {
      const user = await services.user.removeFriend(req.params.userId, req.params.friendId);
      return res.json({message: 'Friend removed', user});
    } catch (err) {
      next(err);
    }
  });

  return router;
};
