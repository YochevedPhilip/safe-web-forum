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

  getPost(postId, limit = 10) {
    return api.get(`/api/posts/${postId}`, { params: { limit } });
  },

    updatePost(postId, payload) {
    const token = localStorage.getItem("token");

    return api.put(
      `/api/posts/${postId}`,
      payload,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
  },

  deletePost(postId) {
    const token = localStorage.getItem("token");

    return api.delete(
      `/api/posts/${postId}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
  },


};
