import Topic from "../data/topicModel.js";
import mongoose from "mongoose";

export const topicRepository = {

  findAllByActivity() {
    return Topic.find({ isActive: true })
      .sort({ lastPostAt: -1, createdAt: -1 });
  },

  findById(id) {
    return Topic.findOne({ _id: id, isActive: true });
  },

  findByNormalizedTitle(normalizedTitle) {
    return Topic.findOne({ normalizedTitle });
  },

  existsById(id) {
    if (!mongoose.isValidObjectId(id)) return Promise.resolve(false);
    return Topic.exists({ _id: new mongoose.Types.ObjectId(id) });
  }

};

