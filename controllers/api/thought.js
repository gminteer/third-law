const router = require('express').Router();

module.exports = (services) => {
  // Get all thoughts
  router.get('/', async (req, res, next) => {
    try {
      const thoughts = await services.thought.getAll();
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
      return res.json(thought);
    } catch (err) {
      next(err);
    }
  });

  // Update a thought by ID
  router.put('/:thoughtId', async (req, res, next) => {
    try {
      const thought = await services.thought.updateThought(req.params.thoughtId, req.body);
      return res.json({message: 'Update successful', thought});
    } catch (err) {
      next(err);
    }
  });

  // Delete a thought by ID
  router.delete('/:thoughtId', async (req, res, next) => {
    try {
      const thought = await services.thought.deleteThought(req.params.thoughtId);
      return res.json({message: 'Delete successful', thought});
    } catch (err) {
      next(err);
    }
  });

  // Create a reaction by thought ID
  router.post('/:thoughtId/reactions', async (req, res, next) => {
    try {
      const reaction = await services.thought.createReaction(req.params.thoughtId, req.body);
      return res.status(201).append('Location', reaction.reactionId).json(reaction);
    } catch (err) {
      next(err);
    }
  });

  // Get a reaction by thought ID & reaction ID
  router.get('/:thoughtId/reactions/:reactionId', async (req, res, next) => {
    try {
      const reaction = await services.thought.getReaction(req.params.thoughtId, req.params.reactionId);
      return res.json(reaction);
    } catch (err) {
      next(err);
    }
  });

  // Update a reaction by thought ID & reaction ID
  router.put('/:thoughtId/reactions/:reactionId', async (req, res, next) => {
    try {
      const reaction = await services.thought.updateReaction(req.params.thoughtId, req.params.reactionId, req.body);
      return res.json({message: 'Update successful', reaction});
    } catch (err) {
      next(err);
    }
  });

  // Delete a reaction by thought ID & reaction ID
  router.delete('/:thoughtId/reactions/:reactionId', async (req, res, next) => {
    try {
      const reaction = await services.thought.deleteReaction(req.params.thoughtId, req.params.reactionId);
      return res.json({message: 'Delete successful', reaction});
    } catch (err) {
      next(err);
    }
  });

  return router;
};
