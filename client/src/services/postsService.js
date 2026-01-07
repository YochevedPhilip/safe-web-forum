import api from "./api";

export const postsService = {
  getTopicPosts(topicId, page, limit) {
    return api.get(`/api/posts/topics/${topicId}/posts`, {
      params: { page, limit },
    });
  },
};
