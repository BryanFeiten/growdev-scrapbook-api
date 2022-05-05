import { Request, Response } from 'express';
import { UserService } from '../services';
import { HttpError } from '../errors';
import { defaultErrorMessage, forbidenMesageContent, HttpBadRequestCode, HttpForbidenCode, HttpNoContentCode, HttpNotFoundCode, HttpSuccessCode, HttpUnauthorizedCode, notFoundContentMessage, unauthorizedLoginMessage, unauthorizedMessage, userAlreadyMessage } from '../constants';
import { UserEntity } from '../database/entities';

export default class UserController {
    async index(request: Request, response: Response) {
        const service = new UserService();
        try {
            const users = await service.find();

            return response.status(HttpSuccessCode).json(users);
        } catch (error) {
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode)
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
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode)
        }
    }

    async store(request: Request, response: Response) {
        const { username, fullName, birthDate, gender, email, password } = request.body;
        const userService = new UserService();

        try {
            const userAlready = await userService.checkUserAlready(email);
            
            if (userAlready === userAlreadyMessage) throw new HttpError(userAlreadyMessage, HttpUnauthorizedCode);

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

        if (userId !== parseInt(id)) {
            throw new HttpError(forbidenMesageContent, HttpForbidenCode);
        }

        const userService = new UserService();

        const currentInformations = await userService.findOne(parseInt(id), userId);

        if (currentInformations === notFoundContentMessage) throw new HttpError(notFoundContentMessage, HttpNotFoundCode);

        const currentEmail = currentInformations.Email;
        const currentPass = currentInformations.Senha;

        if (!currentEmail || !currentPass) throw new HttpError(defaultErrorMessage, HttpBadRequestCode);

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
            throw new HttpError(defaultErrorMessage, HttpBadRequestCode)
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

            if (userToken === unauthorizedLoginMessage) throw new HttpError(unauthorizedLoginMessage, HttpUnauthorizedCode);

            return response.status(HttpSuccessCode).json({
                token: userToken
            });
        } catch (error) {
            throw new HttpError(unauthorizedLoginMessage, HttpUnauthorizedCode);
        }
    }
};