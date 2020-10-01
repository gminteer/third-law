module.exports = (models, errors) => ({
  user: require('./user')(models, errors),
  thought: require('./thought')(models, errors),
});
