"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
// 3rd party
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { Request, Response } = require("express");
// Models
const User = require("../models/usersModel");
const Session = require("../models/sessionModel");
// Services
// const sessionStore = require("../services/store")
// Utils
const createRandomId_1 = __importDefault(require("../utils/createRandomId"));

const regsiterUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }
  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(500);
    throw new Error("Server error registering user");
  }
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  const correctPassword = await bcrypt.compare(password, user.password);
  if (user && correctPassword) {
    var expires = new Date();
    expires.setDate(expires.getDate() + 7);
    const randomId = (0, createRandomId_1.default)();
    res.cookie("userId", randomId);
    Session.create({ cookie: randomId, userId: user.id, expires });
    // req.session.userId = randomId;
    // await sessionStore.set(randomId, user.id);
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({ message: "Invalid credentials" });
  }
});
const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json({ ok: "true" });
});
const logout = asyncHandler(async (req, res) => {
  return res.status(200).json({ ok: "true" });
});
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
module.exports = {
  regsiterUser,
  login,
  getMe,
};
