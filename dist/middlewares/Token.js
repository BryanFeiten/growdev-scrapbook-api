"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const index_2 = require("../index");
const Search_1 = __importDefault(require("../utils/Search"));
async function verifyToken(request, response, next) {
    const { tempToken, token } = request.body;
    if (!token) {
        return response.status(401).json({
            mensagem: "Faça seu login!"
        });
    }
    const userIndex = (0, Search_1.default)('token', token);
    if (userIndex < 0) {
        return response.status(403).json({
            mensagem: "Token inválido."
        });
    }
    jsonwebtoken_1.default.verify(tempToken, index_1.SECRET_KEY, { complete: true }, error => {
        if (error) {
            jsonwebtoken_1.default.verify(token, index_1.SECRET_KEY, { complete: true }, err => {
                if (err) {
                    return response.status(403).json({
                        mensagem: "Seu acesso expirou. Faça o login novamente."
                    });
                }
                else {
                    const refreshToken = index_2.users[userIndex].refreshToken();
                    request.body.tempToken = refreshToken;
                }
            });
        }
    });
    next();
}
exports.default = verifyToken;
