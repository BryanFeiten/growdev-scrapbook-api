"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEnvironmentVariables = exports.logMiddleware = void 0;
const errors_1 = require("../errors");
const constants_1 = require("../constants");
const logMiddleware = (request, response, next) => {
    const { ip, method } = request;
    console.log(ip, method);
    next();
};
exports.logMiddleware = logMiddleware;
const checkEnvironmentVariables = (request, response, next) => {
    if (!process.env.PROTECT_ROUTE_KEY || !process.env.SECRET_KEY)
        throw new errors_1.HttpError(constants_1.unauthorizedMessage, constants_1.HttpUnauthorizedCode);
    next();
};
exports.checkEnvironmentVariables = checkEnvironmentVariables;
