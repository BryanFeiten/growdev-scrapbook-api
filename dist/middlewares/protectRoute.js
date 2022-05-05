"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const errors_1 = require("../errors");
require("dotenv/config");
function protectRoute(request, response, next) {
    const { key } = request.params;
    if (key !== process.env.apiKey) {
        throw new errors_1.HttpError(constants_1.unauthorizedMessage, constants_1.HttpUnauthorizedCode);
    }
    next();
}
exports.default = protectRoute;
