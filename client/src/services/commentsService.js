// import api from "./api";

// export async function createComment({ postId, content, publisherId }) {
//   try {
//     const res = await api.post("/api/comments", { postId, content, publisherId });
//     return { ok: true, data: res.data };
//   } catch (err) {
//     const status = err?.response?.status;
//     const data = err?.response?.data;

//     // זה המקרה של "נחסם ע"י AI" – לא לקרוא לזה "שגיאה כללית"
//     if (status === 403) {
//       return { ok: false, type: "MODERATION_BLOCK", ...data };
//       // data כולל messageToUser/riskLevel/categories כפי שהשרת מחזיר
//     }

//     // שאר השגיאות
//     return {
//       ok: false,
//       type: "GENERIC_ERROR",
//       messageToUser: data?.message || "משהו השתבש. נסי שוב.",
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
