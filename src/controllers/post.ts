import { Request, Response } from 'express';
import { HttpError } from '../errors';
import { defaultErrorMessage, forbidenMesageContent, HttpBadRequestCode, HttpForbidenCode, HttpNoContentCode, HttpNotFoundCode, HttpSuccessCode, notFoundContentMessage, unauthorizedLoginMessage, unauthorizedMessage } from '../constants';
import { PostService } from '../services';

export default class PostController {
    async index(request: Request, response: Response) {
        const { userId } = request.body;
        const service = new PostService();

        try {
            const posts = await service.find(Number(userId));

            return response.status(HttpSuccessCode).json(posts);
        } catch (error) {
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode)
        }
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;
        const { userId } = request.body;
        const postservice = new PostService();

        try {
            const post = await postservice.findOne(parseInt(id), Number(userId));

            if (post === notFoundContentMessage) throw new HttpError(notFoundContentMessage, HttpNotFoundCode);
            if (post === forbidenMesageContent) throw new HttpError(forbidenMesageContent, HttpForbidenCode);

            return response.status(HttpSuccessCode).json(post);
        } catch (error) {
            return response.json(error)
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

            return response.status(HttpSuccessCode).json(post);
        } catch (error) {            
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode)
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

            if (post === notFoundContentMessage) throw new HttpError(notFoundContentMessage, HttpNotFoundCode);
            if (post === forbidenMesageContent) throw new HttpError(forbidenMesageContent, HttpForbidenCode);

            return response.status(HttpSuccessCode).json(post);
        } catch (error) {
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode)
        }
    }

    async delete(request: Request, response: Response) {
        const { userId } = request.body;
        const { id } = request.params;
        const postService = new PostService();

        try {
            const postDelete = await postService.delete(parseInt(id), Number(userId));

            if (postDelete === notFoundContentMessage) throw new HttpError(notFoundContentMessage, HttpNotFoundCode);
            if (postDelete === forbidenMesageContent) throw new HttpError(forbidenMesageContent, HttpForbidenCode);

            return response.sendStatus(HttpNoContentCode);
        } catch (error) {
            console.log(error);
            
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode);
        }
    }
};