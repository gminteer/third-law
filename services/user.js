const bcrypt = require('bcrypt');

const WRITABLE = ['username', 'email'];
const FRIEND_OPS = ['add', 'remove'];

module.exports = (
  {User, Password, Thought},
  {NotFoundError, DuplicateError, MissingPathError, MissingSelectorError}
) => ({
  async get(
    {_id = null, username = null, email = null} = {},
    {includeThoughts = false, includeFriends = false} = {}
  ) {
    if (!_id && !username && !email) {
      let users = User.find();
      if (includeThoughts) users = users.populate('thoughts');
      if (includeFriends) users = users.populate('friends');
      if (users.length < 1) throw new NotFoundError('users');
      return users;
    }
    let user;
    let error;
    if (_id) {
      user = User.findById(_id);
      error = new NotFoundError('users', '_id', _id);
    } else if (username) {
      user = User.findOne({username});
      error = new NotFoundError('users', 'username', username);
    } else if (email) {
      user = User.findOne({email});
      error = new NotFoundError('users', 'email', email);
    }
    if (includeThoughts) user = user.populate('thoughts');
    if (includeFriends) user = user.populate('friends');
    user = await user;
    if (!user) throw error;
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

  async toggleFriend(
    userId,
    {_id = null, username = null, email = null} = {},
    {forceOperation = null} = {}
  ) {
    if (forceOperation && !FRIEND_OPS.includes(forceOperation))
      throw new TypeError(`forceOperation must be one of: ${FRIEND_OPS}`);
    if (!_id && !username && !email) throw new MissingSelectorError(['id', 'username', 'email']);
    let friend;
    let error;
    if (_id) {
      friend = await User.findById(_id);
      error = new NotFoundError('users', '_id', _id);
    } else if (username) {
      friend = await User.findOne({username});
      error = new NotFoundError('users', 'username', username);
    } else if (email) {
      friend = await User.findOne({email});
      error = new NotFoundError('users', 'email', email);
    }
    if (!friend) throw error;
    const user = await User.findOne({_id: userId});
    if (!user) throw new NotFoundError('users', '_id', userId);
    let operation;
    if (user.friends.includes(friend._id)) {
      if (forceOperation && forceOperation === 'add')
        throw new DuplicateError('friends', friend._id);
      await user.friends.pull(friend._id);
      operation = 'removed';
    } else {
      if (forceOperation && forceOperation === 'remove')
        throw new NotFoundError('friends', '_id', friend._id);
      await user.friends.push(friend._id);
      operation = 'added';
    }
    await user.save();
    return {operation, user};
  },

  async checkPassword(username, pwInput) {
    const user = await User.findOne({username}).populate('password');
    if (!user) throw new NotFoundError('users', 'username', username);
    if (await bcrypt.compare(pwInput, user.password.password)) return await User.findById(user._id);
  },

  async changePassword(userId, newPassword) {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('users', '_id', userId);
    await Password.findByIdAndUpdate(user.password, {password: newPassword});
    return user;
  },
});
