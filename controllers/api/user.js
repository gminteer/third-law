const router = require('express').Router();

module.exports = (services, {NotFoundError}) => {
  // Get all users
  router.get('/', async (req, res, next) => {
    try {
      const users = await services.user.getAll();
      if (!users || users.length < 1) throw new NotFoundError('users');
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
      if (!user) throw new NotFoundError('users', req.params.userId);
      return res.json(user);
    } catch (err) {
      next(err);
    }
  });

  // Update a user by ID
  router.put('/:userId', async (req, res, next) => {
    try {
      const user = await services.user.update(req.params.userId, req.body);
      if (!user) throw new NotFoundError('users', req.params.userId);
      return res.json({message: 'Update successful', user});
    } catch (err) {
      next(err);
    }
  });
  // Delete a user by ID
  router.delete('/:userId', async (req, res, next) => {
    try {
      const user = await services.user.delete(req.params.userId);
      if (!user) throw new NotFoundError('users', req.params.userId);
      return res.json({message: 'Delete successful', user});
    } catch (err) {
      next(err);
    }
  });
  return router;
};
