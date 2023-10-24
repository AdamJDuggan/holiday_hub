"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 3rd party
const jwt = require("jsonwebtoken");
const { rateLimit } = require("express-rate-limit");
const asyncHandler = require("express-async-handler");
const { Request, Response, NextFunction } = require("express");
// Models
const User = require("../models/usersModel");
// Services
const sessionStore = require("../services/store");
/**
 * Ensure a user has legitimate session cookie and auth token
 */
const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header start with Bearer
            token = req.headers.authorization.split(" ")[1];
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // Get user from the token
            const mongoUser = await User.findById(decoded.id).select("-password");
            // Get user id from Redis session store
            const cookie = req.cookies["userId"];
            const sessionUserId = await sessionStore.get(cookie);
            console.log(sessionUserId);
            // Resolve if ids match
            if (JSON.stringify(sessionUserId) === JSON.stringify(mongoUser._id))
                return next();
            else
                return res.status(401).json({ message: "NONE!!!" });
        }
        catch (error) {
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
const checkDuplicateEmail = (req, res, next) => {
    User.findOne({
        email: req.body.email,
    }).then((err, user) => {
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
    windowMs: 15 * 60 * 1000,
    limit: 100, // Limit each IP to 100 requests per 15 minutes
});
module.exports = { protect, checkDuplicateEmail, rateLimiter };
