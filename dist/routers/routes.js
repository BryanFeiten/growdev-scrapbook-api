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
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const User_1 = __importDefault(require("../classes/User"));
const Post_1 = __importDefault(require("../classes/Post"));
const rules_1 = require("../controllers/rules");
const middleware_1 = require("../middlewares/middleware");
const index_1 = require("../index");
const router = express_1.default.Router();
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: false }));
router.use((0, cookie_parser_1.default)());
router.use((0, cors_1.default)());
router.use(middleware_1.checkEnvironmentVariables);
router.get('/', (request, response) => {
    return response.status(200).json("API running...");
});
router.get('/data', middleware_1.verifyToken, (request, response) => {
    return response.status(200).json({
        users: index_1.users,
        posts: index_1.posts
    });
});
router.get('/users', middleware_1.verifyToken, (request, response) => {
    const showUsersLikethis = [];
    index_1.users.map(user => showUsersLikethis.push({
        Nome: `${user.firstName} ${user.lastName}`,
        Idade: user.age
    }));
    return response.status(200).json(showUsersLikethis);
});
router.post('/user/registration', middleware_1.verifyFieldsValues, async (request, response) => {
    const { firstName, lastName, gender, email, password, age, phone } = request.body;
    const userAlreadyExists = (0, rules_1.searchIndex)('userEmail', email);
    if (userAlreadyExists === -1) {
        if (firstName && lastName && gender && email && password && age && phone) {
            const newUser = new User_1.default(firstName, lastName, gender, email, phone, await bcrypt.hash(password, 10), age);
            index_1.users.push(newUser);
            return response.status(201).json(newUser);
        }
    }
    else {
        return response.status(409).json({
            mensagem: "O e-mail já está cadastrado na plataforma."
        });
    }
});
router.post('/user/auth', async (request, response) => {
    const { email, password } = request.body;
    try {
        const userIndexFinded = await (0, middleware_1.checkForLogin)(email, password);
        if (userIndexFinded !== -1) {
            let mensagem = "Login efetuado com sucesso!";
            if (index_1.users[userIndexFinded].token) {
                mensagem = "Você foi desconectado de outra sessão, e seu login foi efetuado com sucesso!";
            }
            const token = jsonwebtoken_1.default.sign({ token: index_1.users[userIndexFinded].setToken(request.ip) }, index_1.SECRET_KEY, { expiresIn: "57600000" });
            const tempToken = jsonwebtoken_1.default.sign({ tempToken: index_1.users[userIndexFinded].refreshToken() }, index_1.SECRET_KEY, { expiresIn: "300000" });
            response.cookie('token', token, { maxAge: 57600000, httpOnly: true });
            response.cookie('tempToken', tempToken, { maxAge: 300000, httpOnly: true });
            return response.status(200).json({
                mensagem
            });
        }
        else {
            return response.status(401).json({
                mensagem: "Usuário ou senha inválidos. Por favor verifique e tente novamente!"
            });
        }
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
router.post('/user/logout', middleware_1.verifyToken, (request, response) => {
    const token = request.cookies.token;
    const userIndex = (0, rules_1.searchIndex)('token', token);
    if (userIndex >= 0) {
        index_1.users[userIndex].setLogout();
        response.cookie('token', '');
        response.cookie('tempToken', '');
        return response.sendStatus(204);
    }
    else {
        return response.status(401).json("Você não está logado.");
    }
});
router.get('/posts', middleware_1.verifyToken, async (request, response) => {
    const token = request.cookies.token;
    const userIndexFinded = (0, rules_1.searchIndex)('token', token);
    if (userIndexFinded === -1) {
        return response.status(401).json({
            mensagem: "Você precisa logar."
        });
    }
    const showThisPosts = index_1.posts.filter(post => post.postPrivacity === 'public' || post.userId === index_1.users[userIndexFinded].id);
    return response.status(200).json(showThisPosts);
});
router.get('/post/:postId', middleware_1.verifyToken, async (request, response) => {
    const token = request.cookies.token;
    const { postId } = request.params;
    const postIndex = index_1.posts.findIndex(post => post.id === postId);
    const userIndexFinded = (0, rules_1.searchIndex)('token', token);
    if (userIndexFinded === -1) {
        return response.status(401).json({
            mensagem: "Você precisa logar."
        });
    }
    if (postIndex === -1) {
        return response.status(400).json({
            mensagem: `Infelizmente não encontramos nenhum post com o id ${postId}`,
        });
    }
    const postAuth = index_1.posts[postIndex].userId === index_1.users[userIndexFinded].id ? true : false;
    if (postAuth === true || index_1.posts[postIndex].postPrivacity === 'public') {
        return response.status(200).json(index_1.posts[postIndex]);
    }
    else {
        return response.status(403).json({
            mensagem: "Somente o autor de um post privado pode consultá-lo."
        });
    }
});
router.post('/post/create', middleware_1.verifyToken, (request, response) => {
    const token = request.cookies.token;
    const { postHeader, postContent, postPrivacity } = request.body;
    const userIndexFinded = (0, rules_1.searchIndex)('token', token);
    const { validPost, message } = (0, rules_1.postValidation)(postHeader, postContent, postPrivacity);
    if (token && userIndexFinded >= 0) {
        if (validPost === true) {
            const newPost = new Post_1.default(index_1.users[userIndexFinded].id, postHeader, postContent, postPrivacity);
            index_1.posts.push(newPost);
            return response.status(201).json(newPost);
        }
        else {
            return response.status(400).json({
                message
            });
        }
    }
    else {
        return response.status(401).json({
            mensagem: "Você precisa logar."
        });
    }
});
router.put('/post/modify/:postId', middleware_1.verifyToken, (request, response) => {
    const token = request.cookies.token;
    const { postId } = request.params;
    const { newPostHeader, newPostContent, newPostPrivacity } = request.body;
    const userIndexFinded = (0, rules_1.searchIndex)('token', token);
    const thisPostIndex = (0, rules_1.searchIndex)('post', postId);
    const { validPost, message } = (0, rules_1.postValidation)(newPostHeader, newPostContent, newPostPrivacity);
    if (userIndexFinded >= 0) {
        if (thisPostIndex >= 0) {
            if (index_1.posts[thisPostIndex].userId === index_1.users[userIndexFinded].id) {
                if (validPost === true) {
                    index_1.posts[thisPostIndex].setPostHeader(newPostHeader);
                    index_1.posts[thisPostIndex].setPostContent(newPostContent);
                    index_1.posts[thisPostIndex].setPrivacity(newPostPrivacity);
                    return response.status(200).json(index_1.posts[thisPostIndex]);
                }
                else {
                    return response.status(400).json({
                        message
                    });
                }
            }
            else {
                return response.status(403).json({
                    mensagem: "Apenas o criador do post pode alterar o conteúdo do mesmo."
                });
            }
        }
        else {
            return response.status(400).json({
                mensagem: `Infelizmente não encontramos nenhum post com o id ${postId}.`
            });
        }
    }
    else {
        return response.status(401).json({
            mensagem: "Você precisa logar."
        });
    }
});
router.delete('/post/delete/:postId', middleware_1.verifyToken, (request, response) => {
    const token = request.cookies.token;
    const { postId } = request.params;
    const userIndexFinded = (0, rules_1.searchIndex)('token', token);
    const thisPostIndex = (0, rules_1.searchIndex)('post', postId);
    if (userIndexFinded >= 0) {
        if (thisPostIndex >= 0) {
            if (index_1.posts[thisPostIndex].userId === index_1.users[userIndexFinded].id) {
                index_1.posts.splice(thisPostIndex, 1);
                return response.sendStatus(204);
            }
            else {
                return response.status(403).json({
                    mensagem: "Apenas o criador do post pode excluí-lo."
                });
            }
        }
        else {
            return response.status(400).json({
                mensgem: `Infelizmente não encontramos nenhum post com o id ${postId}.`
            });
        }
    }
    else {
        return response.status(201).json({
            mensagem: "Você precisa logar."
        });
    }
});
exports.default = router;
