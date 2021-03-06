module.exports = ({User, Thought}, {NotFoundError}) => ({
  async getThought(thoughtId) {
    if (!thoughtId) {
      const thoughts = await Thought.find()
        .populate({path: 'author', select: 'username'})
        .populate({path: 'reactions.author', select: 'username'})
        .sort({createdAt: -1})
        .limit(12);
      if (thoughts.length < 1) throw new NotFoundError('thoughts');
      return thoughts;
    }
    const thought = await Thought.findById(thoughtId)
      .populate({
        path: 'author',
        select: 'username',
      })
      .populate({path: 'reactions.author', select: 'username'});
    if (!thought) throw new NotFoundError('thoughts', '_id', thoughtId);
    return thought;
  },

  async createThought(data) {
    if (!data) return;
    const sanitizedData = Object.fromEntries(
      Object.entries(data).filter(([key]) => ['author', 'body'].includes(key))
    );
    const thought = await Thought.create(sanitizedData);
    const user = await User.findById(data.author);
    if (!user) throw new NotFoundError('users', '_id', data.author);
    await user.thoughts.push(thought._id);
    await user.save();
    return thought;
  },

  async updateThought(_id, body) {
    const thought = await Thought.findByIdAndUpdate(
      {_id},
      {body},
      {new: true, runValidators: true}
    ).populate('author');
    return thought;
  },

  async deleteThought(thoughtId) {
    const thought = await Thought.findByIdAndDelete(thoughtId);
    if (!thought) throw new NotFoundError('thoughts', '_id', thoughtId);
    return thought;
  },

  async getReaction(thoughtId, reactionId) {
    const thought = await Thought.findById(thoughtId);
    if (!thought) throw new NotFoundError('thoughts', '_id', thoughtId);
    const reaction = thought.reactions.find(
      (reaction) => reaction.reactionId.toHexString() === reactionId
    );
    if (!reaction) throw new NotFoundError('reactions', 'reactionId', reactionId);
    return reaction;
  },

  async createReaction(thoughtId, data) {
    if (!data) return;
    const thought = await Thought.findById(thoughtId);
    if (!thought) throw new NotFoundError('thoughts', '_id', thoughtId);
    thought.reactions.push(data);
    await thought.save();
    return thought;
  },

  async updateReaction(thoughtId, reactionId, data) {
    if (!data) return;
    const thought = await Thought.findById(thoughtId);
    if (!thought) throw new NotFoundError('thoughts', '_id', thoughtId);
    const reaction = thought.reactions.find(
      (reaction) => reaction.reactionId.toHexString() === reactionId
    );
    if (!reaction) throw new NotFoundError('reactions', 'reactionId', reactionId);
    reaction.body = data.body;
    await thought.save();
    return reaction;
  },

  async deleteReaction(thoughtId, reactionId) {
    const thought = await Thought.findById(thoughtId);
    if (!thought) throw new NotFoundError('thoughts', '_id', thoughtId);
    const reaction = thought.reactions.find(
      (reaction) => reaction.reactionId.toHexString() === reactionId
    );
    if (!reaction) throw new NotFoundError('reactions', 'reactionId', reactionId);
    await Thought.findByIdAndUpdate(thoughtId, {$pull: {reactions: {reactionId}}}, {new: true});
    return reaction;
  },
});
