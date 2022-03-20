"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEnvironmentVariables = exports.verifyToken = exports.checkForLogin = exports.checkUserIndexExists = exports.verifyFieldsValues = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const index_1 = require("../index");
const index_2 = require("../index");
const rules_1 = require("../controllers/rules");
function verifyFieldsValues(request, response, next) {
    const { firstName, lastName, gender, email, age } = request.body;
    let mensagem = '';
    let error = false;
    switch (true) {
        case firstName.length < 3:
            mensagem = 'Seu primeiro nome deve conter pelo menos 3 letras.';
            error = true;
            break;
        case lastName.length < 2:
            mensagem = 'Seu último nome deve conter pelo menos 2 letras.';
            error = true;
            break;
        case gender !== 'masculine' && gender !== 'femine' && gender !== 'non-binary':
            mensagem = 'Por favor insira um gênero válido.';
            error = true;
            break;
        case email.indexOf("@") === -1 || email.indexOf('.com') === -1:
            mensagem = 'Por favor insira um e-mail válido.';
            error = true;
            break;
        case age < 18:
            mensagem = `Infelizmente pessoas menores de idade não podem ter conta na plataforma. retorne após ${(age - 18) * (-1)} ano(s).`;
            error = true;
            break;
    }
    if (error) {
        return response.status(400).json(mensagem);
    }
    else {
        next();
    }
}
exports.verifyFieldsValues = verifyFieldsValues;
function checkUserIndexExists(email) {
    const userIndex = index_2.users.findIndex(user => user.email === email);
    return userIndex;
}
exports.checkUserIndexExists = checkUserIndexExists;
async function checkForLogin(email, password) {
    try {
        const userIndex = index_2.users.findIndex(user => user.email === email);
        const verifyPassword = await bcrypt.compare(password, index_2.users[userIndex].getPassword);
        if (userIndex !== -1 && verifyPassword) {
            return userIndex;
        }
        else {
            return -1;
        }
    }
    catch (error) {
        return -1;
    }
}
exports.checkForLogin = checkForLogin;
async function verifyToken(request, response, next) {
    const temptoken = request.cookies.tempToken;
    const token = request.cookies.token;
    if (!token) {
        return response.json({
            mensagem: "Faça seu login!"
        });
    }
    const userIndex = (0, rules_1.searchIndex)('token', token);
    if (userIndex < 0) {
        return response.status(401).json({
            mensagem: "Token inválido."
        });
    }
    jsonwebtoken_1.default.verify(temptoken, index_1.SECRET_KEY, { complete: true }, error => {
        if (error) {
            jsonwebtoken_1.default.verify(token, index_1.SECRET_KEY, { complete: true }, err => {
                if (err) {
                    return response.status(401).json({
                        mensagem: "Seu acesso expirou. Faça o login novamente."
                    });
                }
                else {
                    const refreshToken = index_2.users[userIndex].refreshToken();
                    const tempToken = jsonwebtoken_1.default.sign({ refreshToken }, index_1.SECRET_KEY, { expiresIn: "300000" });
                    response.cookie('tempToken', tempToken, { maxAge: 300000, httpOnly: true });
                }
            });
        }
    });
    next();
}
exports.verifyToken = verifyToken;
function checkEnvironmentVariables(request, response, next) {
    if (index_1.SECRET_KEY !== 'INVALID KEY') {
        next();
    }
    else {
        return response.status(401).json({
            message: "Variáveis de ambiente incorretas. Fique tranquilo que nossa equipe já está cuidando disso. :)"
        });
    }
}
exports.checkEnvironmentVariables = checkEnvironmentVariables;
