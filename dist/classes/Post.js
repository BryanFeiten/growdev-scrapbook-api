"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const generateId = function idGenerator(userId) {
    const id = jsonwebtoken_1.default.sign({ userId }, index_1.SECRET_KEY);
    return id;
};
class Post {
    constructor(user, postHeader, postContent, postPrivacity) {
        this.user = user;
        this.postHeader = postHeader;
        this.postContent = postContent;
        this.postPrivacity = postPrivacity;
        this.id = generateId(this.user.id);
    }
    setPostHeader(newPostHeader) {
        this.postHeader = newPostHeader;
    }
    setPostContent(newPostContent) {
        this.postContent = newPostContent;
    }
    setPrivacity(newPrivacity) {
        this.postPrivacity = newPrivacity;
    }
}
exports.default = Post;
