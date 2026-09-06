import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

/* =========================================================
   JWT TOKEN
========================================================= */

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn:
        process.env.JWT_EXPIRES_IN ||
        "7d",
    }
  );
};

/* =========================================================
   SAFE USER RESPONSE
========================================================= */

const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone || "",
  role: user.role,
  active: user.active,
  createdAt: user.createdAt,
});

/* =========================================================
   REGISTER
   POST /api/auth/register
========================================================= */

export const register = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
      phone,
    } = req.body;

    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required.",
      });
    }

    const normalizedEmail =
      String(email)
        .trim()
        .toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 6 characters.",
      });
    }

    /* -------------------------------------------------------
       CHECK EXISTING USER
    ------------------------------------------------------- */

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    /* -------------------------------------------------------
       HASH PASSWORD
    ------------------------------------------------------- */

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    /* -------------------------------------------------------
       CREATE USER
    ------------------------------------------------------- */

    const user =
      await User.create({
        name: String(name).trim(),
        email: normalizedEmail,
        password: hashedPassword,
        phone: phone
          ? String(phone).trim()
          : "",
        role: "student",
        active: true,
      });

    /* -------------------------------------------------------
       TOKEN
    ------------------------------------------------------- */

    const token =
      generateToken(user._id);

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully.",
      token,
      user: userResponse(user),
    });
  } catch (error) {
    console.error(
      "Register error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create account.",
    });
  }
};

/* =========================================================
   LOGIN
   POST /api/auth/login
========================================================= */

export const login = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required.",
      });
    }

    const normalizedEmail =
      String(email)
        .trim()
        .toLowerCase();

    /* -------------------------------------------------------
       FIND USER
    ------------------------------------------------------- */

    const user =
      await User.findOne({
        email: normalizedEmail,
      }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    /* -------------------------------------------------------
       ACTIVE CHECK
    ------------------------------------------------------- */

    if (user.active === false) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been disabled.",
      });
    }

    /* -------------------------------------------------------
       CHECK PASSWORD
    ------------------------------------------------------- */

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    /* -------------------------------------------------------
       TOKEN
    ------------------------------------------------------- */

    const token =
      generateToken(user._id);

    return res.status(200).json({
      success: true,
      message:
        "Login successful.",
      token,
      user: userResponse(user),
    });
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to login.",
    });
  }
};

/* =========================================================
   CURRENT USER
   GET /api/auth/me
========================================================= */

export const getMe = async (
  req,
  res
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    return res.status(200).json({
      success: true,
      user: userResponse(
        req.user
      ),
    });
  } catch (error) {
    console.error(
      "Get current user error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load user.",
    });
  }
};
