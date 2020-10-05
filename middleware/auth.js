module.exports = (services, {NotFoundError, AuthError}) => ({
  mustBeLoggedIn(req, res, next) {
    if (!req.session.isLoggedIn) throw new AuthError('NOT_LOGGED_IN');
    next();
  },
  mustBeAnonymous(req, res, next) {
    if (req.session.isLoggedIn) throw new AuthError('NOT_ANONYMOUS');
    next();
  },
  mustOwnEndpoint(req, res, next) {
    if (!req.session.isLoggedIn) throw new AuthError('NOT_LOGGED_IN');
    if (req.session.userId !== req.params.userId) throw new AuthError('NOT_OWNER');
    next();
  },
  async mustOwnThought(req, res, next) {
    try {
      const thought = await services.thought.getThought(req.params.thoughtId);
      if (req.session.userId !== thought.author._id.toHexString()) throw new AuthError('NOT_OWNER');
      next();
    } catch (err) {
      next(err);
    }
  },
  async mustOwnReaction(req, res, next) {
    try {
      const reaction = await services.thought.getReaction(
        req.params.thoughtId,
        req.params.reactionId
      );
      if (req.session.userId !== reaction.author.toHexString()) throw new AuthError('NOT_OWNER');
      next();
    } catch (err) {
      next(err);
    }
  },
});
