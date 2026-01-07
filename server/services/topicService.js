import { topicRepository } from "../repositories/topicRepository.js";
import { AppError } from "../errors/appError.js";



export const topicService = {

  async listTopicsByActivity() {
    return topicRepository.findAllByActivity();
  },

  async getTopicById(id) {
    const topic = await topicRepository.findById(id);
    if (!topic) throw new AppError("topic not found", 404);
    return topic;
  },
};
