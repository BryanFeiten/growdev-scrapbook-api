"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.createUserFieldValidator = exports.loginFieldsValidator = void 0;
const constants_1 = require("../constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_2 = require("../constants");
require("dotenv/config");
function loginFieldsValidator(request, response, next) {
    const { email, password } = request.body;
    if (!email || !password)
        return response.status(constants_1.HttpBadRequestCode).json((0, constants_1.invalidFieldMessage)('Campo(s) de Email ou Senha'));
    switch (true) {
        case email.indexOf("@") === -1 || email.indexOf('.co') === -1 || email.length < 7:
            return response.status(constants_1.HttpBadRequestCode).json({
                mensagem: (0, constants_1.invalidFieldMessage)('Campo de e-mail')
            });
        case password.length < 6:
            return response.status(constants_1.HttpBadRequestCode).json({
                mensagem: (0, constants_1.invalidFieldMessage)('Campo de senha')
            });
    }
    next();
}
exports.loginFieldsValidator = loginFieldsValidator;
function createUserFieldValidator(request, response, next) {
    const { username, fullName, gender, email, password } = request.body;
    if (!username || !fullName || !gender || !email || !password)
        return response.status(constants_1.HttpBadRequestCode).json({
            mensagem: (0, constants_1.invalidFieldMessage)('Campo(s) de registro não enviado(s)')
        });
    switch (true) {
        case username.length < 4:
            return response.status(constants_1.HttpBadRequestCode).json({
                mensagem: (0, constants_1.invalidFieldMessage)('Username')
            });
        case fullName.length === 0:
            return response.status(constants_1.HttpBadRequestCode).json({
                mensagem: (0, constants_1.invalidFieldMessage)('Nome')
            });
        case gender !== 'masculine' && gender !== 'femine' && gender !== 'non-binary':
            return response.status(constants_1.HttpBadRequestCode).json({
                mensagem: (0, constants_1.invalidFieldMessage)('Gênero')
            });
        case email.indexOf("@") === -1 || email.indexOf('.com') === -1:
            return response.status(constants_1.HttpBadRequestCode).json({
                mensagem: (0, constants_1.invalidFieldMessage)('E-mail')
            });
        case password.length < 6:
            return response.status(constants_1.HttpBadRequestCode).json({
                mensagem: (0, constants_1.invalidFieldMessage)('Campo de senha')
            });
    }
    next();
}
exports.createUserFieldValidator = createUserFieldValidator;
async function checkToken(request, response, next) {
    const { token } = request.body;
    if (!token) {
        return response.status(constants_1.HttpBadRequestCode).json({
            mensagem: (0, constants_1.invalidFieldMessage)('Token')
        });
    }
    const userId = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, { complete: false }, (err, decode) => {
        if (err) {
            return response.status(constants_2.HttpUnauthorizedCode).json({
                mensagem: constants_2.unauthorizedMessage
            });
        }
        if (typeof decode !== 'string' && typeof decode !== 'undefined') {
            return parseInt(decode.userId);
        }
        return null;
    });
    request.body.userId = userId;
    next();
}
exports.checkToken = checkToken;
