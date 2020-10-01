const express = require('express');

const errors = require('./errors');
const models = require('./models');
const services = require('./services')(models, errors);
const controllers = require('./controllers')(services);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'pug');
app.use(controllers);

module.exports = app;
