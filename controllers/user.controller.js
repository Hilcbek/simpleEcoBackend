import expressAsync from "express-async-handler";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { ErrorHandler } from "../Error/error.js";
import jwt from "jsonwebtoken";
export let Register = expressAsync(async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    let genSalt = await bcrypt.genSalt(10);
    if (!username || !email || !password)
      return next(ErrorHandler(500, "All fileds are required!"));
    let UserName = await User.findOne({ username: username });
    if (UserName) return next(ErrorHandler(500, "user exist!"));
    let EmailExist = await User.findOne({ email: email });
    if (EmailExist) return next(ErrorHandler(500, "email alreadt exist!"));
    let NewUser = await User.create({
      ...req.body,
      password: await bcrypt.hash(password, genSalt),
    });
    res.status(200).json({ data: NewUser });
  } catch (error) {
    next(error);
  }
});
export let Login = expressAsync(async (req, res, next) => {
  let { username } = req.body;
  if (!username || !req.body.password)
    return next(ErrorHandler(500, "All fields are required!"));
  let UserStatus = await User.findOne({ username });
  if (!UserStatus) return next(ErrorHandler(500, "wrong username!"));
  let Password = await bcrypt.compare(req.body.password, UserStatus.password);
  if (!Password) return next(ErrorHandler(500, "wrong username or password!"));
  let { password, ...UserInfo } = UserStatus._doc;
  jwt.sign(
    { _id: UserInfo._id, isAdmin: UserInfo.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
    (err, token) => {
      if (err) return next(ErrorHandler(500, "Error while generating token!"));
      res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        .json({ data: UserInfo });
    }
  );
});
export let Logout = (req, res, next) => {
  try {
    res.clearCookie("token").status(200).json({ data: "Logged out!" });
  } catch (error) {
    next(error);
  }
};
