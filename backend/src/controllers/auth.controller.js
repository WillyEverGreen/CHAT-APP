import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"; //to hash the password

export const signup = async (req, res) => {
  // res.send("signup Route");//output print karega jab hum search bar mein /api/auth/signup likhenge
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }
    const user = await User.findOne({ email }); //email is necessary for login

    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }
    const salt = await bcrypt.genSalt(10); //generate a salt for hashing
    const hashedPassword = await bcrypt.hash(password, salt); //hash the password with the salt  //convert password(01234567=>ertyuiop)

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate jwt token here
      generateToken(newUser._id, res); //generate token and set it in the cookie
      await newUser.save(); //save the user in the database
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt for email:", email);
  console.log(
    "Environment check - MONGODB_URI exists:",
    !!process.env.MONGODB_URI
  );
  console.log(
    "Environment check - JWT_SECRET exists:",
    !!process.env.JWT_SECRET
  );

  try {
    const user = await User.findOne({ email });
    console.log("User found:", !!user);

    if (!user) {
      console.log("Login failed: User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    console.log("Password check result:", isPasswordCorrect);

    if (!isPasswordCorrect) {
      console.log("Login failed: Invalid password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log("Login successful, generating token for user:", user._id);
    generateToken(user._id, res); //generate token and set it in the cookie
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    console.log("Full error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id; //get user id from the token

    if (!profilePic) {
      return res
        .status(400)
        .json({ message: "Please provide a profile picture." });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url, //update the profile picture in the database
      },
      {
        new: true, //return the updated user
      }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user); //send the user data from the token
  } catch (error) {
    console.log("Error in checkAuth controller:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
