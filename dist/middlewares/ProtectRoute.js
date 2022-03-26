"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
function protectRoute(request, response, next) {
    const { key } = request.params;
    if (key !== index_1.apiKey) {
        return response.status(401).json({
            mensagem: "Pessoa não autorizada."
        });
    }
    next();
}
exports.default = protectRoute;
