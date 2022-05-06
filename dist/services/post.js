"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const constants_1 = require("../constants");
const repositories_1 = require("../database/repositories");
class PostService {
    async find(userId) {
        const repository = new repositories_1.PostRepository();
        const posts = (await repository.find()).filter(post => {
            return post.userId === userId || post.postPrivacity === 'public' ? post : null;
        });
        ;
        return posts;
    }
    async findOne(id, userId) {
        const repository = new repositories_1.PostRepository();
        const post = await repository.findOne(id);
        if (post === constants_1.notFoundContentMessage)
            return constants_1.notFoundContentMessage;
        if (post) {
            return post.userId === userId || post.postPrivacity === 'public' ? post : constants_1.forbidenContentMessage;
        }
        return constants_1.notFoundContentMessage;
    }
    async create(postDTO) {
        const repository = new repositories_1.PostRepository();
        const post = await repository.create(postDTO);
        return post;
    }
    async update(postDTO) {
        const repository = new repositories_1.PostRepository();
        const currentPost = await repository.findOne(postDTO.id);
        if (currentPost === constants_1.notFoundContentMessage)
            return constants_1.notFoundContentMessage;
        if (currentPost.userId !== postDTO.userId)
            return constants_1.forbidenContentMessage;
        const post = await repository.update(postDTO);
        if (!post)
            return constants_1.notFoundContentMessage;
        return post;
    }
    async delete(postId, userId) {
        const repository = new repositories_1.PostRepository();
        const currentPost = await repository.findOne(postId);
        if (currentPost === constants_1.notFoundContentMessage)
            return constants_1.notFoundContentMessage;
        if (currentPost.userId !== userId)
            return constants_1.forbidenContentMessage;
        return await repository.delete(postId);
    }
}
exports.PostService = PostService;
