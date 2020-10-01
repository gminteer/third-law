const router = require('express').Router();

// Can't find an API in mongodb/mongoose to look this up
const MONGO_ERR_DUPLICATE_KEY = 11000;

module.exports = (services) => {
  router.use('/users', require('./user')(services));
  router.use('/thoughts', require('./thought')(services));
  // Common API route error handler
  router.use((err, req, res, next) => {
    console.error(err);
    switch (err.name) {
      case 'NotFoundError': {
        return res.status(404).json({message: err.message, details: {name: 'NOT_FOUND', [err.path]: err.query}});
      }
      case 'DuplicateError': {
        return res.status(400).json({message: err.message, details: {name: 'DUPLICATE', [err.path]: err.value}});
      }
      case 'CastError': {
        return res
          .status(400)
          .json({message: `Invalid object ID: ${err.value}`, details: {name: 'BAD_ID', id: err.value}});
      }
      case 'ValidationError': {
        const paths = Object.keys(err.errors);
        return res
          .status(400)
          .json({message: `Vailed validation on path(s): ${paths}`, details: {name: 'FAILED_VALIDATION', paths}});
      }
      case 'MongoError': {
        switch (err.code) {
          case MONGO_ERR_DUPLICATE_KEY: {
            // Can't find a better way to get error details than just regex parsing err.message
            const [, index] = err.message.match(/index: (\w+)/);
            return res
              .status(422)
              .json({message: `Duplicate key: '${index}'`, details: {name: 'DUPLICATE_KEY', index}});
          }
        }
      }
    }
    if (process.env.NODE_ENV !== 'production') debugger; // If you're reading this you should write a better handler for this error...
    return res.status(500).json({message: err.message, err});
  });
  return router;
};
