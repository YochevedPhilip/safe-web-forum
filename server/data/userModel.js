import mongoose from "mongoose";

const ROLES = ["user", "admin", "super_admin", "expert"];

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    passwordHash: { type: String, required: true },
    
    avatarUrl: { type: String, default: null },

    role: { type: String, enum: ROLES, default: "user", required: true },

    suspendedAt: { type: Date, default: null },

    lastLoginAt: { type: Date, default: null },
  },
  { timestamps: true }
);
 

const User = mongoose.models.Topic || mongoose.model('User', UserSchema);

export default User;
