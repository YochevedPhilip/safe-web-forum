import api from "./api";

export const likesService = {
  likePost(postId) {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?._id || user?.id;

    return api.post(`/api/likes/post/${postId}`, {}, {
      headers: { "x-user-id": userId },
    });
  },

  unlikePost(postId) {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const userId = user?._id || user?.id;

    return api.delete(`/api/likes/post/${postId}`, {
      headers: { "x-user-id": userId },
    });
  },
};
