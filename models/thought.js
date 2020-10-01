const {DateTime} = require('luxon');
const {Schema, model, Types} = require('mongoose');

const baseThought = {
  body: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (timeStamp) => DateTime.fromJSDate(timeStamp).toLocaleString(DateTime.DATETIME_SHORT),
  },
};

const Reaction = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    ...baseThought,
  },
  {
    _id: false,
  }
);

const Thought = new Schema({
  reactions: [Reaction],
  ...baseThought,
});

module.exports = model(Thought);
