import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/utils.js";
import cloudianry from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // check if all fields are filled and password is at least 6 characters
    if (!fullName || !email || !password) {
      return res.status(400).send("All fields are required");
    }
    if (password.length < 6) {
      return res.status(400).send("Password must be at least 6 characters");
    }

    // check if user already exists
    const email_exist = await User.findOne({ email });
    if (email_exist) return res.status(400).send("Email already exists");

    // hash password before saving in database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a new user
    const newUser = await User.create({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate JWT token
      generateToken(newUser._id, res);
      await newUser.save();

      // return the user data
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).send("Invalid User Data");
    }

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if all fields are filled
    if (!email || !password)
      return res.status(400).send("All fields are required");

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User does not exist");

    // check if password is correct
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).send("Invalid Password");

    // generate JWT token
    generateToken(user._id, res);

    // return the user data
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const logout = async (req, res) => {
  try {
    // remove the JWT token from the user's browser
    res.clearCookie("jwt", "", { maxAge: 0 });
    res.status(200).send("Signed out successfully");
  } catch (error) {
    console.log("Error in logout controller : " + error);
    res.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).send("Invalid User");

    const userId = req.user._id;

    const uploadReponse = await cloudianry.uploader.upload(profilePic);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadReponse.secure_url },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    console.log("Error in updateProfile controller: " + error);
    res.status(500).send("Internal Server Error");
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller: " + error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
