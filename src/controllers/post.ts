import { Request, Response } from 'express';
import { HttpError } from '../errors';
import {
    defaultErrorMessage,
    forbidenContentMessage,
    HttpBadRequestCode,
    HttpCreatedCode,
    HttpForbidenCode,
    HttpNoContentCode,
    HttpNotFoundCode,
    HttpSuccessCode,
    notFoundContentMessage,
} from '../constants';
import { PostService } from '../services';

export default class PostController {
    async index(request: Request, response: Response) {
        const { userId } = request.body;
        const service = new PostService();

        try {
            const posts = await service.find(Number(userId));

            return response.status(HttpSuccessCode).json(posts);
        } catch (error) {
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode);
        }
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;
        const { userId } = request.body;
        const postservice = new PostService();

        try {
            const post = await postservice.findOne(parseInt(id), Number(userId));

            if (post === notFoundContentMessage) return response.status(HttpNotFoundCode).json({
                mensagem: notFoundContentMessage
            })

            if (post === forbidenContentMessage) return response.status(HttpForbidenCode).json({
                mensagem: forbidenContentMessage
            })

            return response.status(HttpSuccessCode).json(post);
        } catch (error) {
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode)
        }
    }

    async store(request: Request, response: Response) {
        const { userId, postHeader, postContent, postPrivacity } = request.body;
        const postService = new PostService();

        try {
            const post = await postService.create({
                userId,
                postHeader,
                postContent,
                postPrivacity,
            });

            return response.status(HttpCreatedCode).json(post);
        } catch (error) {
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode);
        }
    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { userId, postHeader, postContent, postPrivacity } = request.body;
        const postService = new PostService();

        try {
            const post = await postService.update({
                id: parseInt(id),
                userId,
                postHeader,
                postContent,
                postPrivacity
            });

            if (post === notFoundContentMessage) return response.status(HttpNotFoundCode).json({
                mensagem: notFoundContentMessage
            })

            if (post === forbidenContentMessage) return response.status(HttpForbidenCode).json({
                mensagem: forbidenContentMessage
            })

            return response.status(HttpSuccessCode).json(post);
        } catch (error) {
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode);
        }
    }

    async delete(request: Request, response: Response) {
        const { userId } = request.body;
        const { id } = request.params;
        const postService = new PostService();

        try {
            const postDelete = await postService.delete(parseInt(id), Number(userId));

            if (postDelete === notFoundContentMessage) return response.status(HttpNotFoundCode).json({
                mensagem: notFoundContentMessage
            })

            if (postDelete === forbidenContentMessage) return response.status(HttpForbidenCode).json({
                mensagem: forbidenContentMessage
            })

            return response.sendStatus(HttpNoContentCode);
        } catch (error) {
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode);
        }
    }
};