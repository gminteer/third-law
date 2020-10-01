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

const reactionSchema = new Schema(
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
    toObject: {virtuals: true, getters: true},
    toJSON: {getters: true},
  }
);

const thoughtSchema = new Schema(
  {
    reactions: [reactionSchema],
    ...baseThought,
  },
  {
    id: false,
    toObject: {virtuals: true, getters: true},
    toJSON: {virtuals: true, getters: true},
  }
);

thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

module.exports = model('Thought', thoughtSchema);
