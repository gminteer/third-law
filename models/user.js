const {Schema, model} = require('mongoose');

const userSchema = new Schema(
  {
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
    password: {type: Schema.Types.ObjectId, ref: 'Password', select: false},
    thoughts: [{type: Schema.Types.ObjectId, ref: 'Thought'}],
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
  },
  {
    id: false,
    toJSON: {virtuals: true, getters: true},
  }
);

userSchema.virtual('friendCount').get(function () {
  return this.friends && this.friends.length;
});
userSchema.virtual('thoughtCount').get(function () {
  return this.thoughts && this.thoughts.length;
});

module.exports = model('User', userSchema);
