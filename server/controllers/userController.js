import { userService } from "../services/userService.js";

import jwt from "jsonwebtoken";

const makeToken = (user) => jwt.sign({userId: user._id, username: user.username},
  process.env.JWT_SECRET, {expiresIn:"1h"}
);

export const userController = {
  // async create(req, res, next) {
  //   try {
  //     const { username, email, password } = req.body;
  //     const user = await userService.createUser({ username, email, passwordHash: password });
  //     return res.status(201).json(user);
  //   } catch (err) {
  //     return next(err);
  //   }
    // res.send("Successfully registered!");
    async register(req, res, next) {
      console.log("REGISTER BODY:", req.body);
    try {
      const { username, email, password } = req.body;
      const user = await userService.createUser({ username, email, password });
      const token = makeToken(user);
      return res.status(201).json({
        token,
        user: {id: user._id, username: user.username, email: user.email},
      });
    } catch (err) {
      //handle duplicate email
      if(err?.code === 11000) {
        return res.status(409).json({message: "Email already exists"});
      }
      return res.status(500).json({message: err.message || "Server error"});
      // return next(err);
    }
  },

  async login(req, res) {
    try {
      const {email, password} = req.body;
      const user = await userService.login({email, password});
      const token = makeToken(user);

      return res.json({
        token,
        user: {id: user._id, username: user.username, email: user.email},
      });
    } catch (err) {
      return res.status(401).json({message: "Invalid email or password"});
    }
  },
};