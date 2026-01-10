import api from "./api";
export const likesService = {
  likePost(postId) {
    const token = localStorage.getItem("token");

    return api.post(
      `/api/likes/post/${postId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  unlikePost(postId) {
    const token = localStorage.getItem("token");

    return api.delete(`/api/likes/post/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

