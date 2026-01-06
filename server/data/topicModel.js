import mongoose from "mongoose";

const TopicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80
    },

    normalizedTitle: {
      type: String,
      lowercase: true,
      trim: true
    },

    createdByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastPostAt: { type: Date, default: null },
    postsCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

TopicSchema.pre("validate", function (next) {
  if (this.title) {
    this.normalizedTitle = this.title.trim().toLowerCase();
  }
  next();
});

TopicSchema.index({ normalizedTitle: 1 }, { unique: true });

TopicSchema.index({ title: 1 });

TopicSchema.index({ lastPostAt: -1 });


const Topic = mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
export default Topic;
