import User from "../data/userModel.js";
import { userRepository } from "../repositories/userRepository.js";
// import { normalizeTitle } from "../utils/normalize.js";

import bcrypt from "bcrypt"

//TODO: use the one in the errors file instead
export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const userService = {
  async createUser({ username, email, password }) {
    const passwordHash = await bcrypt.hash(password, 10);
    if (!email || !username || !password) {
      throw new AppError("missing field", 400);
    }
    // check email validity
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email)) {  
      throw new AppError("valid email is required", 400);
    }
    if (email.trim().length === 0) {
      throw new AppError("email cannot be empty", 400);
    }

    //check if user already exists in db
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({email: normalizedEmail});
    if(existingUser) {
      throw new Error("Email already registered");
    }

    return userRepository.create({
        email: normalizedEmail,
        username,
        passwordHash,
    });
  },

  async login({email, password}) {
    const user = await userRepository.findByEmail(email.trim().toLowerCase());
    if(!user) throw new Error("Invalid email or password");
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new Error("Invalid email or password");

    return user;
  },
};
