import User from "../models/user.model.js";
import bcrypt from 'bcrypt'

export const updateController = async (req, res, next) => {
  try {
    const userData = req.user;
    const updatedData = req.body;

    if(req.body.password){
      req.body.password = await bcrypt.hash(req.body.password, 10)
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userData._id },
      { $set: updatedData },
      { new: true }
    ).select({ password: 0 });

    res.status(200).json(updatedUser);
    console.log(updatedUser);
  } catch (error) {
    console.log("User error", error);
    next(error);
  }
};

export const userController = async (req, res, next) => {
  try {
    const userData = req.user;

    const user = await User.findOne({ _id: userData._id });
    
    res.status(200).json(user)
  } catch (error) {
    console.log(error);
    next(error);
  }
};


export const deleteUserController = async (req, res, next) => {
  try {
    const userData = req.user;

    const deletedUser = await User.deleteOne({ _id: userData._id });
    res.status(200).json("deleted");
  } catch (error) {
    console.log(error);
    next(error);
  }
};