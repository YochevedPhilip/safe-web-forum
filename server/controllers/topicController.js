import { topicService } from "../services/topicService.js";

export const topicController = {
  async create(req, res, next) {
    try {
      const { title, createdByUserId } = req.body;
      const topic = await topicService.createTopic({ title, createdByUserId });
      res.status(201).json(topic);
    } catch (err) {
      next(err);
    }
  },

  async list(req, res, next) {
    try {
      const topics = await topicService.listTopics();
      res.json(topics);
    } catch (err) {
      next(err);
    }
  },

  async getById(req, res, next) {
    try {
      const topic = await topicService.getTopicById(req.params.id);
      res.json(topic);
    } catch (err) {
      next(err);
    }
  },
};
