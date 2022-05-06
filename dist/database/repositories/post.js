"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const entities_1 = require("../entities");
const constants_1 = require("../../constants");
class PostRepository {
    async find() {
        const posts = await entities_1.PostEntity.find();
        return posts;
    }
    async findOne(id) {
        const post = await entities_1.PostEntity.findOne(id);
        if (!post)
            return constants_1.notFoundContentMessage;
        return post;
    }
    async create(postDTO) {
        const post = new entities_1.PostEntity(postDTO.userId, postDTO.postHeader, postDTO.postContent, postDTO.postPrivacity);
        await post.save();
        return post;
    }
    async update(postDTO) {
        const post = await entities_1.PostEntity.findOne(postDTO.id);
        if (post) {
            post.postHeader = postDTO.postHeader;
            post.postContent = postDTO.postContent;
            post.postPrivacity = postDTO.postPrivacity;
            await post.save();
        }
        return post;
    }
    async delete(postId) {
        const post = await entities_1.PostEntity.findOne(postId);
        if (post) {
            await entities_1.PostEntity.delete(postId);
            return constants_1.successProccessMessage;
        }
        return constants_1.notFoundContentMessage;
    }
}
exports.PostRepository = PostRepository;
