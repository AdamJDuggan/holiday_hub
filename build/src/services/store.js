"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const sessionStore = (0, redis_1.createClient)();
sessionStore.on("error", (err) => console.log("Redis Client Error", err));
const connectStore = async () => await sessionStore.connect();
connectStore();
module.exports = sessionStore;
