const router = require('express').Router();

module.exports = (services, {NotFoundError}) => {
  // Get all thoughts
  router.get('/', async (req, res, next) => {
    try {
      const thoughts = await services.thought.getAll();
      if (!thoughts || thoughts.length < 1) throw new NotFoundError('thoughts');
      return res.json(thoughts);
    } catch (err) {
      next(err);
    }
  });
  // Create a thought
  router.post('/', async (req, res, next) => {
    try {
      const thought = await services.thought.createThought(req.body);
      return res.status(201).append('Location', thought._id).json(thought);
    } catch (err) {
      next(err);
    }
  });
  // Get a thought by ID
  router.get('/:thoughtId', async (req, res, next) => {
    try {
      const thought = await services.thought.getById(req.params.thoughtId);
      if (!thought) throw new NotFoundError('thoughts', req.params.thoughtId);
      return res.json(thought);
    } catch (err) {
      next(err);
    }
  });
  // Update a thought by ID
  router.put('/:thoughtId', async (req, res, next) => {
    try {
      const thought = await services.thought.updateThought(req.params.thoughtId, req.body);
      if (!thought) throw new NotFoundError('thoughts', req.params.thoughtId);
      return res.json({message: 'Update successful', thought});
    } catch (err) {
      next(err);
    }
  });
  // Delete a thought by ID
  router.delete('/:thoughtId', async (req, res, next) => {
    try {
      const thought = await services.thought.deleteThought(req.params.thoughtId);
      if (!thought) throw new NotFoundError('thoughts', req.params.thoughtId);
      return res.json({message: 'Delete successful', thought});
    } catch (err) {
      next(err);
    }
  });
  // Create a reaction to a thought by thought ID
  router.post('/:thoughtId/reactions', async (req, res, next) => {
    try {
      const reaction = await services.thought.createReaction(req.params.thoughtId, req.body);
      if (!reaction) throw new NotFoundError('thoughts', req.params.thoughtId);
      return res.json(reaction);
    } catch (err) {
      next(err);
    }
  });
  return router;
};
