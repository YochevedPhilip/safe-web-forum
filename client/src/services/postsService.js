import api from "./api";

export const postsService = {
  getTopicPosts(topicId, page, limit) {
    const token = localStorage.getItem("token");
    console.log("token in getTopicPosts:", token);

    return api.get(`/api/posts/topics/${topicId}/posts`, {
      params: { page, limit },
            headers: token ? { Authorization: `Bearer ${token}` } : {},

    });
  },
};
