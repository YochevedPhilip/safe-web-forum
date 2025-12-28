import mongoose from "mongoose";

const CONTENT_STATUS = ['OK', 'SENSITIVE', 'HARMFUL'];
const MOD_REASONS = [
  'HATE',
  'HARASSMENT',
  'SELF_HARM',
  'VIOLENCE',
  'SEXUAL',
  'ILLEGAL',
  'SPAM',
  'PERSONAL_DATA',
  'OTHER'  
];
 
const ModerationSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: CONTENT_STATUS,
      default: 'OK',
      required: true
    },
   
    reasons: { 
      type: [{ type: String, enum: MOD_REASONS }],
      default: [] 
    },

    helpFlag: { type: Boolean, default: false },
    evaluatedAt: { type: Date, default: null },//לשקול למחוק אם קורה בזמן אמת
  },
  { _id: false }
);

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    publisherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: { 
      type: String, 
      required: true, 
      maxlength: 3000, 
      trim: true },

    parentCommentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
      index: true,
    },

    publishedAt: { type: Date, default: null },
    blockedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },

    moderation: { type: ModerationSchema, default: () => ({}) },

    stats: {
      likeCount: { type: Number, default: 0, min: 0 },
      replyCount: { type: Number, default: 0, min: 0 },
    },
  },
  { timestamps: true }
);


CommentSchema.index({ publisherId: 1, publishedAt: -1 });

CommentSchema.index(
  { postId: 1, publishedAt: 1 },
  { partialFilterExpression: { blockedAt: null, deletedAt: null, publishedAt: { $type: "date" } } }
);

CommentSchema.index(
  { parentCommentId: 1, publishedAt: 1 },
  { partialFilterExpression: { blockedAt: null, deletedAt: null, publishedAt: { $type: "date" } } }
);


const Comment = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
export default Comment;







