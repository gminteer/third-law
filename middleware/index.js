module.exports = (services, errors) => ({
  auth: require('./auth')(services, errors),
});
