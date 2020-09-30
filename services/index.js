module.exports = (models) => ({
  user: require('./user')(models),
});
