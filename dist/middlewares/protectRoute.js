"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
require("dotenv/config");
function protectRoute(request, response, next) {
    const { key } = request.params;
    if (key !== process.env.apiKey)
        return response.status(constants_1.HttpUnauthorizedCode).json({
            mensagem: constants_1.unauthorizedMessage
        });
    next();
}
exports.default = protectRoute;
