import User from "../data/userModel.js";

export const userRepository = {
  create(data) {
    return User.create(data);
  },

//   findAll() {
//     return User.find({ isActive: true }).sort({ createdAt: -1 });
//   },

  findById(id) {
    return User.findById(id);
  },

  findByEmail(email) {
    return User.findOne({email});
  },

//   findByNormalizedTitle(normalizedTitle) {
//     return User.findOne({ normalizedTitle });
//   },
};
