"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var session = require("express-session");
var store = new session.MemoryStore();
module.exports = store;
