const bcrypt = require('bcrypt');
const {Schema, model} = require('mongoose');

const passwordSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
});

passwordSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

passwordSchema.pre('findOneAndUpdate', async function (next) {
  this.update.password = await bcrypt.hash(this.update.password, 10);
  next();
});
module.exports = model('Password', passwordSchema);
