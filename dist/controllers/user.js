"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const errors_1 = require("../errors");
const constants_1 = require("../constants");
class UserController {
    async index(request, response) {
        const service = new services_1.UserService();
        try {
            const users = await service.find();
            return response.status(constants_1.HttpSuccessCode).json(users);
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpBadRequestCode);
        }
    }
    async show(request, response) {
        const { id } = request.params;
        const { userId } = request.body;
        const userservice = new services_1.UserService();
        try {
            const user = await userservice.findOne(parseInt(id), userId);
            return response.status(constants_1.HttpSuccessCode).json(user);
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpBadRequestCode);
        }
    }
    async store(request, response) {
        const { username, fullName, birthDate, gender, email, password } = request.body;
        const userService = new services_1.UserService();
        try {
            const user = await userService.create({
                username,
                fullName,
                birthDate,
                gender,
                email,
                password,
            });
            return response.status(constants_1.HttpSuccessCode).json({
                username: user.username,
                email: user.email,
                birthDate: user.birthDate,
                Gender: user.gender,
            });
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpBadRequestCode);
        }
    }
    async update(request, response) {
        const { id } = request.params;
        const { userId, username, fullName, gender, birthDate } = request.body;
        if (userId !== parseInt(id)) {
            throw new errors_1.HttpError(constants_1.forbidenMesageContent, constants_1.HttpForbidenCode);
        }
        const userService = new services_1.UserService();
        const currentInformations = await userService.findOne(parseInt(id), userId);
        if (currentInformations === constants_1.notFoundContentMessage)
            throw new errors_1.HttpError(constants_1.notFoundContentMessage, constants_1.HttpNotFoundCode);
        const currentEmail = currentInformations.Email;
        const currentPass = currentInformations.Senha;
        if (!currentEmail || !currentPass)
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpBadRequestCode);
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
            return response.status(constants_1.HttpSuccessCode).json(user);
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpBadRequestCode);
        }
    }
    async delete(request, response) {
        const { id } = request.params;
        const userService = new services_1.UserService();
        try {
            await userService.delete(parseInt(id));
            return response.sendStatus(constants_1.HttpNoContentCode);
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.defaultErrorMessage, constants_1.HttpBadRequestCode);
        }
    }
    async login(request, response) {
        const { email, password } = request.body;
        const userService = new services_1.UserService();
        try {
            const userToken = await userService.verifyIfUserExists({ email, password });
            if (userToken === constants_1.unauthorizedLoginMessage)
                throw new errors_1.HttpError(constants_1.unauthorizedLoginMessage, constants_1.HttpUnauthorizedCode);
            return response.status(constants_1.HttpSuccessCode).json({
                token: userToken
            });
        }
        catch (error) {
            throw new errors_1.HttpError(constants_1.unauthorizedLoginMessage, constants_1.HttpUnauthorizedCode);
        }
    }
}
exports.default = UserController;
;
