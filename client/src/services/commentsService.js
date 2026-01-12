// import api from "./api";

// export async function createComment({ postId, content, publisherId }) {
//   try {
//     const res = await api.post("/api/comments", { postId, content, publisherId });
//     return { ok: true, data: res.data };
//   } catch (err) {
//     const status = err?.response?.status;
//     const data = err?.response?.data;

//     // This is the case of "blocked by AI" - don't call this a "generic error"
//     if (status === 403) {
//       return { ok: false, type: "MODERATION_BLOCK", ...data };
//       // data includes messageToUser/riskLevel/categories as returned by server
//     }

//     // Other errors
//     return {
//       ok: false,
//       type: "GENERIC_ERROR",
//       messageToUser: data?.message || "Something went wrong. Please try again.",
//       status,
//     };
//   }
// }

import api from "./api";

export const commentService = {
  getCommentsByPost(postId) {
    return api.get(`/api/comments/${postId}`);
  },

  addComment(postId, content) {
    return api.post(`/api/comments`, { postId, content });
  },
};
