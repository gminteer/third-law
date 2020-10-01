const {DateTime} = require('luxon');
const {Schema, model, Types} = require('mongoose');

const baseThought = {
  body: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
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
    id: false,
    toJSON: {getters: true},
  }
);

const Thought = new Schema(
  {
    reactions: [Reaction],
    ...baseThought,
  },
  {
    toJSON: {virtuals: true, getters: true},
  }
);

Thought.virtual('reactionCount', function () {
  return this.reactions.length;
});

module.exports = model('Thought', Thought);
