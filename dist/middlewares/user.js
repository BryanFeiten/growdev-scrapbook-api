"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkToken = exports.createUserFieldValidator = exports.loginFieldsValidator = void 0;
const constants_1 = require("../constants");
const errors_1 = require("../errors");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_2 = require("../constants");
require("dotenv/config");
function loginFieldsValidator(request, response, next) {
    const { email, password } = request.body;
    if (!email || !password)
        return response.status(constants_1.HttpBadRequestCode).json((0, constants_1.invalidFieldMessage)('Campo(s) de Email ou Senha'));
    switch (true) {
        case email.indexOf("@") === -1 || email.indexOf('.co') === -1 || email.length < 7:
            throw new errors_1.HttpError((0, constants_1.invalidFieldMessage)('E-mail'), constants_1.HttpBadRequestCode);
        case password.length < 6:
            throw new errors_1.HttpError((0, constants_1.invalidFieldMessage)('Password'), constants_1.HttpBadRequestCode);
    }
    next();
}
exports.loginFieldsValidator = loginFieldsValidator;
function createUserFieldValidator(request, response, next) {
    const { username, fullName, gender, email, password } = request.body;
    switch (true) {
        case username.length < 4:
            throw new errors_1.HttpError((0, constants_1.invalidFieldMessage)('Username'), constants_1.HttpBadRequestCode);
        case fullName.length < 10:
            throw new errors_1.HttpError((0, constants_1.invalidFieldMessage)('Nome'), constants_1.HttpBadRequestCode);
        case gender !== 'masculine' && gender !== 'femine' && gender !== 'non-binary':
            throw new errors_1.HttpError((0, constants_1.invalidFieldMessage)('Gênero'), constants_1.HttpBadRequestCode);
        case email.indexOf("@") === -1 || email.indexOf('.com') === -1:
            throw new errors_1.HttpError((0, constants_1.invalidFieldMessage)('E-mail'), constants_1.HttpBadRequestCode);
        case password.length < 6:
            throw new errors_1.HttpError((0, constants_1.invalidFieldMessage)('Password'), constants_1.HttpBadRequestCode);
    }
    next();
}
exports.createUserFieldValidator = createUserFieldValidator;
async function checkToken(request, response, next) {
    const { token } = request.body;
    if (!token) {
        return response.status(constants_1.HttpBadRequestCode).json((0, constants_1.invalidFieldMessage)('Token'));
    }
    const userId = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, { complete: false }, (err, decode) => {
        if (err) {
            throw new errors_1.HttpError(constants_2.unauthorizedMessage, constants_2.HttpUnauthorizedCode);
        }
        if (typeof decode !== 'string' && typeof decode !== 'undefined') {
            return Number(decode.userId);
        }
        return null;
    });
    request.body.userId = userId;
    next();
}
exports.checkToken = checkToken;
