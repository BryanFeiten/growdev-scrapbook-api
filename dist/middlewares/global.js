"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEnvironmentVariables = exports.logMiddleware = void 0;
const constants_1 = require("../constants");
const logMiddleware = (request, response, next) => {
    const { ip, method } = request;
    console.log(ip, method);
    next();
};
exports.logMiddleware = logMiddleware;
const checkEnvironmentVariables = (request, response, next) => {
    if (!process.env.PROTECT_ROUTE_KEY || !process.env.SECRET_KEY)
        return response.status(constants_1.HttpUnauthorizedCode).json({
            mensagem: constants_1.unauthorizedMessage
        });
    next();
};
exports.checkEnvironmentVariables = checkEnvironmentVariables;
