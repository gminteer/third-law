const bcrypt = require('bcrypt');

const WRITABLE = ['username', 'email'];

module.exports = (
  {User, Password, Thought},
  {NotFoundError, DuplicateError, MissingPathError}
) => ({
  async getAll() {
    const users = await User.find();
    if (users.length < 1) throw new NotFoundError('users');
    return users;
  },

  async getById(userId) {
    const user = await User.findById(userId).populate('thoughts').populate('friends');
    if (!user) throw new NotFoundError('users', '_id', userId);
    return user;
  },

  async create(data) {
    if (!data || !data.password) throw new MissingPathError('password');
    const password = await Password.create({password: data.password});
    const sanitizedData = Object.fromEntries(
      Object.entries(data).filter(([key]) => WRITABLE.includes(key))
    );
    const user = await User.create({password: password._id, ...sanitizedData});
    return user;
  },

  async update(userId, data) {
    const sanitizedData = Object.fromEntries(
      Object.entries(data).filter(([key]) => WRITABLE.includes(key))
    );
    const user = await User.findByIdAndUpdate(userId, sanitizedData, {
      new: true,
      runValidators: true,
    });
    if (!user) throw new NotFoundError('users', '_id', userId);
    return user;
  },

  async delete(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new NotFoundError('users', '_id', userId);
    for (const thoughtId of user.thoughts) await Thought.findByIdAndDelete(thoughtId);
    return user;
  },

  async addFriend(userId, friendId) {
    const friend = await User.findById(friendId);
    if (!friend) throw new NotFoundError('users', 'friendId', friendId);
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('users', '_id', userId);
    if (user.friends.includes(friendId)) throw new DuplicateError('friends', friendId);
    user.friends.push(friendId);
    await user.save();
    return user;
  },

  async removeFriend(userId, friendId) {
    const friend = await User.findById(friendId);
    if (!friend) throw new NotFoundError('users', 'friendId', friendId);
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('users', '_id', userId);
    if (!user.friends.includes(friendId)) throw new NotFoundError('friends', 'friendId', friendId);
    user.friends.pull(friendId);
    await user.save();
    return user;
  },

  async checkPassword(username, pwInput) {
    const user = await User.findOne({username}).populate('password');
    if (!user) throw new NotFoundError('users', 'username', username);
    if (await bcrypt.compare(pwInput, user.password.password)) return await User.findById(user._id);
  },

  async changePassword(userId, newPassword) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('users', '_id', userId);
    const password = Password.findByIdAndUpdate(user.password, {password: newPassword});
    return user;
  },
});
