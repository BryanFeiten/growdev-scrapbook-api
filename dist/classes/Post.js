"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateId = function idGenerator(userId) {
    const id = `${Math.random().toString(36).substring(8)}-${Math.random().toString(36).substring(8)}-${Math.random().toString(36).substring(8)}`;
    return id;
};
class Post {
    constructor(userId, postHeader, postContent, postPrivacity) {
        this.userId = userId;
        this.postHeader = postHeader;
        this.postContent = postContent;
        this.postPrivacity = postPrivacity;
        this.id = generateId(this.userId);
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
