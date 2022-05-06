import { Request, Response } from 'express';
import { UserService } from '../services';
import { HttpError } from '../errors';
import {
    defaultErrorMessage,
    forbidenContentMessage,
    HttpBadRequestCode,
    HttpForbidenCode,
    HttpNoContentCode,
    HttpNotFoundCode,
    HttpSuccessCode,
    HttpUnauthorizedCode,
    notFoundContentMessage,
    unauthorizedLoginMessage,
    unauthorizedMessage,
    userAlreadyMessage
} from '../constants';
export default class UserController {
    async index(request: Request, response: Response) {
        const service = new UserService();
        try {
            const users = await service.find();

            return response.status(HttpSuccessCode).json(users);
        } catch (error) {
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode);
        }
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;
        const { userId } = request.body;
        const userservice = new UserService();

        try {
            const user = await userservice.findOne(parseInt(id), userId);

            return response.status(HttpSuccessCode).json(user);
        } catch (error) {
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode);
        }
    }

    async store(request: Request, response: Response) {
        const { username, fullName, birthDate, gender, email, password } = request.body;
        const userService = new UserService();

        try {
            const userAlready = await userService.checkUserAlready(email);

            if (userAlready === userAlreadyMessage) return response.status(HttpUnauthorizedCode).json({
                mensagem: userAlreadyMessage
            })

            const user = await userService.create({
                username,
                fullName,
                birthDate,
                gender,
                email,
                password,
            });

            return response.status(HttpSuccessCode).json({
                username: user.username,
                email: user.email,
                birthDate: user.birthDate,
                Gender: user.gender,
            });
        } catch (error) {
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode);
        }
    }

    async update(request: Request, response: Response) {
        const { id } = request.params;
        const { userId, username, fullName, gender, birthDate } = request.body;

        if (userId !== parseInt(id)) return response.status(HttpForbidenCode).json({
            mensagem: forbidenContentMessage
        })

        const userService = new UserService();

        const currentInformations = await userService.findOne(parseInt(id), userId);

        if (currentInformations === notFoundContentMessage) return response.status(HttpNotFoundCode).json({
            mensagem: notFoundContentMessage
        })

        const currentEmail = currentInformations.Email;
        const currentPass = currentInformations.Senha;

        if (!currentEmail || !currentPass) return response.status(HttpBadRequestCode).json({
            mensagem: defaultErrorMessage
        })

        try {
            const user = await userService.update({
                id: parseInt(id),
                username,
                fullName,
                gender,
                birthDate,
                email: currentEmail,
                password: currentPass,
            });

            return response.status(HttpSuccessCode).json(user);
        } catch (error) {
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode);
        }
    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        const userService = new UserService();

        try {
            await userService.delete(parseInt(id));

            return response.sendStatus(HttpNoContentCode);
        } catch (error) {
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode);
        }
    }

    async login(request: Request, response: Response) {
        const { email, password } = request.body;
        const userService = new UserService();

        try {
            const userToken = await userService.checkLoginData({ email, password });

            if (userToken === unauthorizedLoginMessage) return response.status(HttpUnauthorizedCode).json({
                mensagem: unauthorizedMessage
            })

            return response.status(HttpSuccessCode).json({
                token: userToken
            });
        } catch (error) {
            throw new HttpError(unauthorizedLoginMessage, HttpUnauthorizedCode);
        }
    }
};