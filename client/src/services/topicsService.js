import api from "./api";


export const topicsService = {
  getTopic(topicId) {
    return api.get(`/api/topics/${topicId}`);
  },
};
