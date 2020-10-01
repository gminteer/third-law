const WRITABLE = ['body', 'username'];
module.exports = ({User, Thought}, {NotFoundError}) => ({
  getAll: async () => await Thought.find(),
  getById: async (_id) => await Thought.findOne({_id}),
  deleteThought: async (_id) => await Thought.findOneAndDelete({_id}),

  async createThought(data) {
    if (!data) return;
    const user = await User.findOne({username: data.username});
    if (!user) throw new NotFoundError('users', data.username);
    const sanitizedData = Object.fromEntries(Object.entries(data).filter(([key]) => WRITABLE.includes(key)));
    const thought = await Thought.create(sanitizedData);
    user.thoughts.push(thought._id);
    await user.save();
    return thought;
  },

  async updateThought(_id, data) {
    if (!data) return;
    const user = await User.findOne({username: data.username});
    if (!user) throw new NotFoundError('users', data.username);
    const sanitizedData = Object.fromEntries(Object.entries(data).filter(([key]) => WRITABLE.includes(key)));
    const thought = await Thought.findByIdAndUpdate({_id}, sanitizedData, {new: true, runValidators: true});
    return thought;
  },
});
