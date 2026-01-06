import { userRepository } from "../repositories/userRepository.js";
// import { normalizeTitle } from "../utils/normalize.js";

import bcrypt from "bcrypt"

export class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const userService = {
  async createUser({ username, email, password }) {
    const passwordHash = await bcrypt.hash(password, 10);
    if (!email || typeof email !== "string") {  // TODO: add email validity check
      throw new AppError("valid email is required", 400);
    }
    if (email.trim().length === 0) {
      throw new AppError("email cannot be empty", 400);
    }

    // TODO: add more validation checks for the rest of the fields

    // const normalizedTitle = normalizeTitle(title);

    //TODO: check if user already exists in db

    // const existing = await userService.findByNormalizedTitle(normalizedTitle);
    // if (existing) {
    //   throw new AppError("user already exists", 409);
    // }

    return userRepository.create({
    //   title: title.trim(),
    //   normalizedTitle,
    //   createdByUserId,
        email: email.trim().toLowerCase(),
        username,
        passwordHash,
    });
  },

  async login({email, password}) {
    const user = await userRepository.findByEmail(email.trim().toLowerCase());
    if(!user) throw new Error("Invalid email or password");
    // const user = await bcrypt.compare(password, user.passwordHash);
    const ok = await bcrypt.compare(password, user.passwordHash);//password === user.passwordHash;
    if (!ok) throw new Error("Invalid email or password");

    return user;
  },

//   async listTopics() {
//     return topicRepository.findAll();
//   },

//   async getTopicById(id) {
//     const topic = await topicRepository.findById(id);
//     if (!topic) throw new AppError("topic not found", 404);
//     return topic;
//   },
};
