import { topicService } from "../services/topicService.js";

export const topicController = {


  async list(req, res, next) {
    try {
      const topics = await topicService.listTopicsByActivity();
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
