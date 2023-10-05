// 3rd party
const jwt = require("jsonwebtoken");
const { rateLimit } = require("express-rate-limit");
const asyncHandler = require("express-async-handler");
const { Request, Response, NextFunction } = require("express");
// Models
const User = require("../models/usersModel");

const protect = asyncHandler(async (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header start with Bearer
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const checkDuplicateEmail = (req: typeof Request, res: typeof Response, next: typeof NextFunction) => {
  // Username
  User.findOne({
    email: req.body.email,
  }).then((err: object, user: object) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Email is already in use!" });
      return;
    }
    next();
  });
};

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 100 requests per 15 minutes
});

module.exports = { protect, checkDuplicateEmail, rateLimiter };
