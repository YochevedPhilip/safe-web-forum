import { userService } from "../services/userService.js";

export const userController = {
  async create(req, res, next) {
    try {
      const { username, email, password } = req.body;
      const user = await userService.createUser({ username, email, passwordHash: password });
      return res.status(201).json(user);
    } catch (err) {
      return next(err);
    }
    // res.send("Successfully registered!");
  },
};