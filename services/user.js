const PROPERTIES = ['username', 'email'];

module.exports = ({User}) => ({
  async getAll() {
    const users = await User.find().select('-__v');
    return users;
  },

  async getById(_id) {
    const user = await User.findOne({_id}).select('-__v');
    return user;
  },

  async create(userData) {
    const sanitizedData = Object.fromEntries(Object.entries(userData).filter(([key]) => PROPERTIES.includes(key)));
    const user = await User.create(sanitizedData);
    return user;
  },

  async update(_id, userData) {
    const sanitizedData = Object.fromEntries(Object.entries(userData).filter(([key]) => PROPERTIES.includes(key)));
    const user = User.findOneAndUpdate({_id}, sanitizedData, {new: true, runValidators: true});
    return user;
  },

  async delete(_id) {
    const user = await User.findOneAndDelete({_id});
    return user;
  },
});
