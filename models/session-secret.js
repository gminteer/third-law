const {Schema, model} = require('mongoose');

const secretSchema = new Schema({secret: String});

module.exports = model('SessionSecret', secretSchema);
