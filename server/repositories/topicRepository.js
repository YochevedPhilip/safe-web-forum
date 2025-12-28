import Topic from "../data/topicModel.js";

export const topicRepository = {
  create(data) {
    return Topic.create(data);
  },

  findAll() {
    return Topic.find({ isActive: true }).sort({ createdAt: -1 });
  },

  findById(id) {
    return Topic.findById(id);
  },

  findByNormalizedTitle(normalizedTitle) {
    return Topic.findOne({ normalizedTitle });
  },
};
