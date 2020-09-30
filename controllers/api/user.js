const router = require('express').Router();

class NotFoundError extends Error {
  constructor(resource, query) {
    const message = query ? `No ${resource} found matching ${query}` : `No ${resource} found`;
    super(message);
    this.name = 'NotFoundError';
    this.resource = resource;
    this.query = query;
  }
}

module.exports = (services) => {
  // TODO
  router.get('/', async (req, res, next) => {
    try {
      const users = await services.user.getAll();
      if (!users || users.length < 1) throw new NotFoundError('users');
      return res.json(users);
    } catch (err) {
      next(err);
    }
  });
  router.post('/', async (req, res, next) => {
    try {
      const user = await services.user.create(req.body);
      return res.status(201).append('Location', user._id).json(user);
    } catch (err) {
      next(err);
    }
  });
  router.get('/:userId', async (req, res, next) => {
    try {
      const user = await services.user.getById(req.params.userId);
      if (!user) throw new NotFoundError('users', req.params.userId);
      return res.json(user);
    } catch (err) {
      next(err);
    }
  });
  router.put('/:userId', async (req, res, next) => {
    try {
      const user = await services.user.update(req.params.userId, req.body);
      if (!user) throw new NotFoundError('users', req.params.userId);
      return res.json(user);
    } catch (err) {
      next(err);
    }
  });
  return router;
};
