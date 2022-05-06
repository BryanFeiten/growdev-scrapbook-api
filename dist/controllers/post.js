"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const constants_1 = require("../constants");
const services_1 = require("../services");
class PostController {
    async index(request, response) {
        const { userId } = request.body;
        const service = new services_1.PostService();
        try {
            const posts = await service.find(Number(userId));
            return response.status(constants_1.HttpSuccessCode).json(posts);
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpBadRequestCode);
        }
    }
    async show(request, response) {
        const { id } = request.params;
        const { userId } = request.body;
        const postservice = new services_1.PostService();
        try {
            const post = await postservice.findOne(parseInt(id), Number(userId));
            if (post === constants_1.notFoundContentMessage)
                return response.status(constants_1.HttpNotFoundCode).json({
                    mensagem: constants_1.notFoundContentMessage
                });
            if (post === constants_1.forbidenContentMessage)
                return response.status(constants_1.HttpForbidenCode).json({
                    mensagem: constants_1.forbidenContentMessage
                });
            return response.status(constants_1.HttpSuccessCode).json(post);
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpBadRequestCode);
        }
    }
    async store(request, response) {
        const { userId, postHeader, postContent, postPrivacity } = request.body;
        const postService = new services_1.PostService();
        try {
            const post = await postService.create({
                userId,
                postHeader,
                postContent,
                postPrivacity,
            });
            return response.status(constants_1.HttpCreatedCode).json(post);
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpBadRequestCode);
        }
    }
    async update(request, response) {
        const { id } = request.params;
        const { userId, postHeader, postContent, postPrivacity } = request.body;
        const postService = new services_1.PostService();
        try {
            const post = await postService.update({
                id: parseInt(id),
                userId,
                postHeader,
                postContent,
                postPrivacity
            });
            if (post === constants_1.notFoundContentMessage)
                return response.status(constants_1.HttpNotFoundCode).json({
                    mensagem: constants_1.notFoundContentMessage
                });
            if (post === constants_1.forbidenContentMessage)
                return response.status(constants_1.HttpForbidenCode).json({
                    mensagem: constants_1.forbidenContentMessage
                });
            return response.status(constants_1.HttpSuccessCode).json(post);
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpBadRequestCode);
        }
    }
    async delete(request, response) {
        const { userId } = request.body;
        const { id } = request.params;
        const postService = new services_1.PostService();
        try {
            const postDelete = await postService.delete(parseInt(id), Number(userId));
            if (postDelete === constants_1.notFoundContentMessage)
                return response.status(constants_1.HttpNotFoundCode).json({
                    mensagem: constants_1.notFoundContentMessage
                });
            if (postDelete === constants_1.forbidenContentMessage)
                return response.status(constants_1.HttpForbidenCode).json({
                    mensagem: constants_1.forbidenContentMessage
                });
            return response.sendStatus(constants_1.HttpNoContentCode);
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpBadRequestCode);
        }
    }
}
exports.default = PostController;
;
