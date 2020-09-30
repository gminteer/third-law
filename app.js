const express = require('express');

const models = require('./models');
const services = require('./services')(models);
const controllers = require('./controllers')(services);

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(controllers);

module.exports = app;
