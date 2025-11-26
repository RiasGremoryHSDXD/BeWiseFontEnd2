import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (request, response) => {
  try {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return response.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return response
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    if (!email.includes("@gmail.com")) {
      return response.status(400).json({ message: "Invalid email" });
    }

    if (password.includes(username)) {
      return response
        .status(400)
        .json({ message: "Password cannot contain username" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return response.status(400).json({ message: "The Email already taken" });
    }

    const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;
    const user = new User({
      username,
      email,
      password,
      profileImage,
    });

    await user.save();

    return response.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError")
      return response.status(400).json({ message: error.message });

    console.error("Registration Error: ", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/login", async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return response
        .status(400)
        .json({ message: "Invalid email or password" });
    }

    console.log("LOGIN SECRET:", process.env.JWT_TOKEN_SECRET);

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return response.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login Error", error);
    return response.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
