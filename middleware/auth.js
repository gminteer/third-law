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
    const thought = await services.thought.getById(req.params.thoughtId);
    if (!thought) throw new NotFoundError('thoughts', '_id', req.params.thoughtId);
    if (req.session.userId !== thought.author.toHexString()) throw new AuthError('NOT_OWNER');
    next();
  },
  async mustOwnReaction(req, res, next) {
    const reaction = await services.thought.getReaction(
      req.params.thoughtId,
      req.params.reactionId
    );
    if (!reaction) throw new NotFoundError('reactions', 'reactionId', req.params.reactionId);
    if (req.session.userId !== reaction.author.toHexString()) throw new AuthError('NOT_OWNER');
    next();
  },
});
