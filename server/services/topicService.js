import { topicRepository } from "../repositories/topicRepository.js";
import { normalizeTitle } from "../utils/normalize.js";

export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const topicService = {
  async createTopic({ title, createdByUserId = null }) {
    if (!title || typeof title !== "string") {
      throw new AppError("title is required", 400);
    }
    if (title.trim().length === 0) {
      throw new AppError("title cannot be empty", 400);
    }

    const normalizedTitle = normalizeTitle(title);

    const existing = await topicRepository.findByNormalizedTitle(normalizedTitle);
    if (existing) {
      throw new AppError("topic title already exists", 409);
    }

    return topicRepository.create({
      title: title.trim(),
      normalizedTitle,
      createdByUserId,
    });
  },

  async listTopics() {
    return topicRepository.findAll();
  },

  async getTopicById(id) {
    const topic = await topicRepository.findById(id);
    if (!topic) throw new AppError("topic not found", 404);
    return topic;
  },
};
