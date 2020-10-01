const WRITABLE = ['username', 'email'];

module.exports = ({User}, {NotFoundError}) => ({
  getAll: async () => await User.find(),
  getById: async (_id) => await User.findById(_id).populate('thoughts').populate('friends'),
  delete: async (_id) => await User.findByIdAndDelete(_id),

  async create(data) {
    const sanitizedData = Object.fromEntries(Object.entries(data).filter(([key]) => WRITABLE.includes(key)));
    const user = await User.create(sanitizedData);
    return user;
  },

  async update(_id, data) {
    const sanitizedData = Object.fromEntries(Object.entries(data).filter(([key]) => WRITABLE.includes(key)));
    const user = await User.findByIdAndUpdate(_id, sanitizedData, {new: true, runValidators: true});
    return user;
  },

  async addFriend(userId, friendId) {
    const user = await User.findByIdAndUpdate(userId, {$push: {friends: friendId}});
    if (!user) throw new NotFoundError('users', userId);
    return user;
  },

  async removeFriend(userId, friendId) {
    const user = await User.findByIdAndUpdate(userId, {$pull: {friends: friendId}});
    if (!user) throw new NotFoundError('users', userId);
    return user;
  },
});
