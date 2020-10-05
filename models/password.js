const bcrypt = require('bcrypt');
const {Schema, model} = require('mongoose');

const passwordSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
});

passwordSchema.pre('save', async function (next) {
  // "this" isn't invalid it just isn't obvious. this === the document getting saved
  // eslint-disable-next-line no-invalid-this
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

passwordSchema.pre('findOneAndUpdate', async function (next) {
  // "this" === the query object that's going to get applied to the password getting updated
  // eslint-disable-next-line no-invalid-this
  this.update.password = await bcrypt.hash(this.update.password, 10);
  next();
});
module.exports = model('Password', passwordSchema);
