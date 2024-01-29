import { errorHandler } from "../middlewares/error.js";
import User from "../models/user.model.js";

export const registerController = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return next(errorHandler(400, "User already exist"));
    }

    const newUser = await User.create({ username, email, password });

    res.status(201).json({
      message: "User created successfully",
      token: await newUser.generateToken(),
      id: newUser._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return next(errorHandler(404, "User not found"));
    }

    const isPasswordValid = await userExist.comparePassword(password);

    if (isPasswordValid) {
      res.status(201).json({
        message: "Login Successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      return next(errorHandler(400, "Wrong Inforamtion"));
    }
  } catch (error) {
    next(error);
  }
};

export const googleController = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const { password: hashedPassword, ...rest } = user._doc;
      res.status(201).json({
        message: "User created successfully",
        token: await user.generateToken(),
        id: user._id.toString(),
      });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const newUser = new User({
        username:
          req.body.username.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: generatedPassword,
        profilePicture: req.body.profilePicture,
      });

      await newUser.save();
      res.status(201).json({
        message: "User created successfully",
        token: await newUser.generateToken(),
        id: newUser._id.toString(),
      });
    }
  } catch (error) {}
};
