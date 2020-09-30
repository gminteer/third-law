const {Schema, model} = require('mongoose');

const User = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    index: {
      unique: true,
      collation: {locale: 'en', strength: 2},
    },
  },
  email: {
    type: String,
    required: true,
    match: /^[\w%+-.]+@[A-Z0-9-.]+\.[A-Z]{2,}$/i,
    index: {
      unique: true,
      collation: {locale: 'en', strength: 2},
    },
  },
  thoughts: [{type: Schema.Types.ObjectId, ref: 'Thought'}],
  friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
});

User.virtual('friendCount').get(function () {
  return this.friends.length;
});

module.exports = model('User', User);
