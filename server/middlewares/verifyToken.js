import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized HTTP, Token not provided" });
  }

  const jwtToken = token.replace("Bearer ", "").trim();

  try {
    const isVerified = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    // Use findOne with email directly in the query
    const userData = await User.findOne({ email: isVerified.email }).select(
      "-password"
    );

    if (userData) {
      req.user = userData;
      req.token = token;
      req.id = userData._id;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized HTTP, Invalid Token" });
  }
};
