const WRITABLE = ['body', 'username'];

module.exports = ({User, Thought}, {NotFoundError}) => ({
  async getAll() {
    const thoughts = await Thought.find();
    if (thoughts.length < 1) throw new NotFoundError('thoughts');
    return thoughts;
  },

  async getById(thoughtId) {
    const thought = await Thought.findById(thoughtId);
    if (!thought) throw new NotFoundError('thoughts', '_id', thoughtId);
    return thought;
  },

  async createThought(data) {
    if (!data) return;
    const user = await User.findOne({username: data.username});
    if (!user) throw new NotFoundError('users', 'username', data.username);
    const sanitizedData = Object.fromEntries(
      Object.entries(data).filter(([key]) => WRITABLE.includes(key))
    );
    const thought = await Thought.create(sanitizedData);
    user.thoughts.push(thought._id);
    await user.save();
    return thought;
  },

  async updateThought(_id, data) {
    if (!data) return;
    const user = await User.findOne({username: data.username});
    if (!user) throw new NotFoundError('users', 'username', data.username);
    const sanitizedData = Object.fromEntries(
      Object.entries(data).filter(([key]) => WRITABLE.includes(key))
    );
    const thought = await Thought.findByIdAndUpdate({_id}, sanitizedData, {
      new: true,
      runValidators: true,
    });
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
    const user = await User.findOne({username: data.username});
    if (!user) throw new NotFoundError('users', 'username', data.username);
    const thought = await Thought.findById(thoughtId);
    if (!thought) throw new NotFoundError('thoughts', '_id', thoughtId);
    const sanitizedData = Object.fromEntries(
      Object.entries(data).filter(([key]) => WRITABLE.includes(key))
    );
    thought.reactions.push(sanitizedData);
    await thought.save();
    return thought;
  },

  async updateReaction(thoughtId, reactionId, data) {
    if (!data) return;
    const user = await User.findOne({username: data.username});
    if (!user) throw new NotFoundError('users', 'username', data.username);
    const thought = await Thought.findById(thoughtId);
    if (!thought) throw new NotFoundError('thoughts', '_id', thoughtId);
    const reaction = thought.reactions.find(
      (reaction) => reaction.reactionId.toHexString() === reactionId
    );
    if (!reaction) throw new NotFoundError('reactions', 'reactionId', reactionId);
    Object.entries(data)
      .filter(([key]) => WRITABLE.includes(key))
      .forEach(([key, value]) => (reaction[key] = value));
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
