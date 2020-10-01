const WRITABLE = ['username', 'email'];

module.exports = ({User}) => ({
  getAll: async () => await User.find(),
  getById: async (_id) => await User.findById(_id).populate({path: 'thoughts'}),
  delete: async (_id) => await User.findByIdAndDelete(_id),

  async create(data) {
    const sanitizedData = Object.fromEntries(Object.entries(data).filter(([key]) => WRITABLE.includes(key)));
    const user = await User.create(sanitizedData);
    return user;
  },

  async update(_id, data) {
    const sanitizedData = Object.fromEntries(Object.entries(data).filter(([key]) => WRITABLE.includes(key)));
    const user = await User.findOneAndUpdate({_id}, sanitizedData, {new: true, runValidators: true});
    return user;
  },
});
