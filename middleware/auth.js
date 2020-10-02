module.exports = (services, {AuthError}) => ({
  mustBeLoggedIn(req, res, next) {
    if (!req.session.isLoggedIn) throw new AuthError('NOT_LOGGED_IN');
    next();
  },
  mustBeAnonymous(req, res, next) {
    if (req.session.isLoggedIn) throw new AuthError('NOT_ANONYMOUS');
    next();
  },
  mustBeOwner(req, res, next) {
    if (!req.session.isLoggedIn) throw new AuthError('NOT_LOGGED_IN');
    if (req.session.userId !== req.params.userId) throw new AuthError('NOT_OWNER');
    next();
  },
});
