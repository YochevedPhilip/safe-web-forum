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

    helpFlag: { type: Boolean, default: false },

    reasons: { 
      type: [{ type: String, enum: MOD_REASONS }],
      default: [] 
    },
    evaluatedAt: { type: Date, default: null },//לשקול למחוק אם קורה בזמן אמת
  },
  { _id: false }
);

const AdminNoteSchema = new mongoose.Schema(
  {
    text: { type: String, maxlength: 1000, required: true },
    adminUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const PostSchema = new mongoose.Schema(
  {
    publisherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
anonymous: { 
  type: Boolean, 
  default: false,
  index: true    
},

    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
  
    content: {
      type: String,
      required: true,
      trim: true
    },

    publishedAt: { type: Date, default: null },
    blockedAt: { type: Date, default: null },
    deletedAt: { type: Date, default: null },

    moderation: { type: ModerationSchema, default: () => ({}) },

    stats: {
      commentCount: { type: Number, default: 0, min: 0 },
      likeCount: { type: Number, default: 0, min: 0 },
    },

    adminNote: { type: AdminNoteSchema, default: null },
  },
  { timestamps: true }
);

PostSchema.index({content: "text" });

PostSchema.index(
  { publishedAt: -1 },
  {
    partialFilterExpression: {
      publishedAt: { $type: "date" },
      blockedAt: null,
      deletedAt: null,
    },
  }
);

PostSchema.index({ publisherId: 1, createdAt: -1 });

PostSchema.index({ topicId: 1, createdAt: -1 });


const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;


