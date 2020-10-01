const express = require('express');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const cryptoRandomString = require('crypto-random-string');

const errors = require('./errors');
const models = require('./models');
const services = require('./services')(models, errors);
const controllers = require('./controllers')(services);

const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: '_session_store',
});

async function sessionSecret() {
  const storedSecret = await models.SessionSecret.findOne();
  if (storedSecret) return storedSecret.secret;
  const secret = await cryptoRandomString.async({length: 32, type: 'ascii-printable'});
  await models.SessionSecret.create({secret});
  return secret;
}

module.exports = async () => {
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));
  app.use(
    session({
      secret: await sessionSecret(),
      cookie: {maxAge: 1000 * 60 * 60}, // 1 hour session expiry
      store,
      resave: true,
      saveUninitialized: true,
    })
  );
  app.set('view engine', 'pug');
  app.use(controllers);

  return app;
};
