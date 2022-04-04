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
const bcrypt = __importStar(require("bcrypt"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const User_1 = __importDefault(require("../classes/User"));
const Post_1 = __importDefault(require("../classes/Post"));
const index_1 = require("../index");
const ProtectRoute_1 = __importDefault(require("../middlewares/ProtectRoute"));
const Environment_1 = __importDefault(require("../middlewares/Environment"));
const Token_1 = __importDefault(require("../middlewares/Token"));
const Registration_1 = __importDefault(require("../middlewares/Registration"));
const Register_1 = __importDefault(require("../utils/Register"));
const Search_1 = __importDefault(require("../utils/Search"));
const Post_2 = __importDefault(require("../utils/Post"));
const router = express_1.default.Router();
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: false }));
router.use((0, cors_1.default)());
router.use(Environment_1.default);
router.get('/', (request, response) => {
    return response.status(200).json("API running...");
});
router.post('/token', Token_1.default, (request, response) => {
    const { tempToken } = request.body;
    const userIndex = (0, Search_1.default)('tempToken', tempToken);
    if (userIndex >= 0) {
        return response.status(200).json({
            mensagem: "Token Ok",
            tempToken
        });
    }
    return response.status(200).json({
        mensagem: "Token Ok"
    });
});
router.get('/protect/:key', ProtectRoute_1.default, (request, response) => {
    return response.json({
        users: index_1.users,
        posts: index_1.posts
    });
});
router.post('/myId', Token_1.default, (request, response) => {
    const { tempToken } = request.body;
    const userIndex = (0, Search_1.default)('tempToken', tempToken);
    if (index_1.users[userIndex].tempTokenRefreshed) {
        index_1.users[userIndex].tempTokenRefreshed = false;
        return response.status(200).json({
            id: index_1.users[userIndex].id,
            tempToken
        });
    }
    return response.status(200).json({
        id: index_1.users[userIndex].id
    });
});
router.get('/users', Token_1.default, (request, response) => {
    const { tempToken } = request.body;
    const userIndex = (0, Search_1.default)('tempToken', tempToken);
    const showUsersLikethis = [];
    index_1.users.map(user => showUsersLikethis.push({
        Nome: `${user.firstName} ${user.lastName}`,
        Idade: user.age
    }));
    if (index_1.users[userIndex].tempTokenRefreshed) {
        index_1.users[userIndex].tempTokenRefreshed = false;
        return response.status(200).json({
            showUsersLikethis,
            tempToken
        });
    }
    return response.status(200).json({
        showUsersLikethis: showUsersLikethis
    });
});
router.post('/user/registration', Registration_1.default, async (request, response) => {
    const { firstName, lastName, gender, email, password, age, phone } = request.body;
    const userAlreadyExists = (0, Search_1.default)('userEmail', email);
    if (userAlreadyExists === -1) {
        if (firstName && lastName && gender && email && password && age && phone) {
            const newUser = new User_1.default(firstName, lastName, gender, email, phone, await bcrypt.hash(password, 10), age);
            index_1.users.push(newUser);
            return response.status(201).json(newUser);
        }
    }
    else {
        return response.status(400).json({
            mensagem: "O e-mail já está cadastrado na plataforma."
        });
    }
});
router.post('/user/auth', async (request, response) => {
    const { email, password } = request.body;
    try {
        const userIndexFinded = await (0, Register_1.default)(email, password);
        if (userIndexFinded !== -1) {
            let mensagem = "Login efetuado com sucesso!";
            if (index_1.users[userIndexFinded].token.signToken) {
                mensagem = "Você foi desconectado de outra sessão, e seu login foi efetuado com sucesso!";
            }
            const { token, tempToken } = index_1.users[userIndexFinded].setLogin(request.ip);
            index_1.users[userIndexFinded].tempTokenRefreshed = false;
            return response.status(200).json({
                mensagem,
                token,
                tempToken
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
router.post('/user/logout', Token_1.default, (request, response) => {
    const { token } = request.body;
    const userIndex = (0, Search_1.default)('token', token);
    if (userIndex >= 0) {
        index_1.users[userIndex].setLogout();
        return response.sendStatus(204);
    }
    else {
        return response.status(401).json("Você não está logado.");
    }
});
router.post('/posts', Token_1.default, async (request, response) => {
    const { tempToken } = request.body;
    const userIndex = (0, Search_1.default)('tempToken', tempToken);
    if (userIndex === -1) {
        return response.status(401).json({
            mensagem: "Você precisa logar."
        });
    }
    const showThisPosts = index_1.posts.filter(post => post.postPrivacity === 'public' || post.userId === index_1.users[userIndex].id);
    if (index_1.users[userIndex].tempTokenRefreshed) {
        index_1.users[userIndex].tempTokenRefreshed = false;
        return response.status(200).json({
            showThisPosts,
            tempToken
        });
    }
    return response.status(200).json({
        showThisPosts: showThisPosts
    });
});
router.post('/post/search/:postId', Token_1.default, async (request, response) => {
    const { tempToken } = request.body;
    const { postId } = request.params;
    const postIndex = index_1.posts.findIndex(post => post.id === postId);
    const userIndex = (0, Search_1.default)('tempToken', tempToken);
    if (userIndex === -1) {
        return response.status(401).json({
            mensagem: "Você precisa logar."
        });
    }
    if (postIndex === -1) {
        if (index_1.users[userIndex].tempTokenRefreshed) {
            index_1.users[userIndex].tempTokenRefreshed = false;
            return response.status(400).json({
                mensagem: `Infelizmente não encontramos nenhum post com o id ${postId}`,
                tempToken
            });
        }
        return response.status(400).json({
            mensagem: `Infelizmente não encontramos nenhum post com o id ${postId}`
        });
    }
    const postAuth = index_1.posts[postIndex].userId === index_1.users[userIndex].id ? true : false;
    if (postAuth === true || index_1.posts[postIndex].postPrivacity === 'public') {
        if (index_1.users[userIndex].tempTokenRefreshed) {
            index_1.users[userIndex].tempTokenRefreshed = false;
            return response.status(200).json({
                post: index_1.posts[postIndex],
                tempToken
            });
        }
        return response.status(200).json({
            post: index_1.posts[postIndex]
        });
    }
    else {
        if (index_1.users[userIndex].tempTokenRefreshed) {
            index_1.users[userIndex].tempTokenRefreshed = false;
            return response.status(403).json({
                mensagem: "Somente o autor de um post privado pode consultá-lo.",
                tempToken
            });
        }
        return response.status(403).json({
            mensagem: "Somente o autor de um post privado pode consultá-lo."
        });
    }
});
router.post('/post/create', Token_1.default, (request, response) => {
    const { postHeader, postContent, postPrivacity, tempToken } = request.body;
    const userIndex = (0, Search_1.default)('tempToken', tempToken);
    const { validPost, message } = (0, Post_2.default)(postHeader, postContent, postPrivacity);
    console.log(validPost, message);
    console.log(postHeader);
    console.log(postContent);
    console.log(postPrivacity);
    if (tempToken && userIndex >= 0) {
        if (validPost === true) {
            const newPost = new Post_1.default(index_1.users[userIndex].id, `${index_1.users[userIndex].firstName}`, `${index_1.users[userIndex].lastName}`, postHeader, postContent, postPrivacity);
            index_1.posts.push(newPost);
            if (index_1.users[userIndex].tempTokenRefreshed) {
                index_1.users[userIndex].tempTokenRefreshed = false;
                return response.status(201).json({
                    newPost,
                    tempToken
                });
            }
            return response.status(201).json({
                newPost: newPost
            });
        }
        else {
            if (index_1.users[userIndex].tempTokenRefreshed) {
                index_1.users[userIndex].tempTokenRefreshed = false;
                return response.status(400).json({
                    mensagem: message,
                    tempToken
                });
            }
            return response.status(400).json({
                mensagem: message
            });
        }
    }
    else {
        return response.status(401).json({
            mensagem: "Você precisa logar."
        });
    }
});
router.put('/post/modify/:postId', Token_1.default, (request, response) => {
    const { postId } = request.params;
    const { newPostHeader, newPostContent, newPostPrivacity, tempToken } = request.body;
    const userIndex = (0, Search_1.default)('tempToken', tempToken);
    const thisPostIndex = (0, Search_1.default)('post', postId);
    const { validPost, message } = (0, Post_2.default)(newPostHeader, newPostContent, newPostPrivacity);
    if (userIndex >= 0) {
        if (thisPostIndex >= 0) {
            if (index_1.posts[thisPostIndex].userId === index_1.users[userIndex].id) {
                if (validPost === true) {
                    index_1.posts[thisPostIndex].setPostHeader(newPostHeader);
                    index_1.posts[thisPostIndex].setPostContent(newPostContent);
                    index_1.posts[thisPostIndex].setPrivacity(newPostPrivacity);
                    if (index_1.users[userIndex].tempTokenRefreshed) {
                        index_1.users[userIndex].tempTokenRefreshed = false;
                        return response.status(200).json({
                            post: index_1.posts[thisPostIndex],
                            tempToken
                        });
                    }
                    return response.status(200).json({
                        post: index_1.posts[thisPostIndex]
                    });
                }
                else {
                    if (index_1.users[userIndex].tempTokenRefreshed) {
                        index_1.users[userIndex].tempTokenRefreshed = false;
                        return response.status(400).json({
                            mensagem: message,
                            tempToken
                        });
                    }
                    return response.status(400).json({
                        message
                    });
                }
            }
            else {
                if (index_1.users[userIndex].tempTokenRefreshed) {
                    index_1.users[userIndex].tempTokenRefreshed = false;
                    return response.status(403).json({
                        mensagem: "Apenas o criador do post pode alterar o conteúdo do mesmo.",
                        tempToken
                    });
                }
                return response.status(403).json({
                    mensagem: "Apenas o criador do post pode alterar o conteúdo do mesmo."
                });
            }
        }
        else {
            if (index_1.users[userIndex].tempTokenRefreshed) {
                index_1.users[userIndex].tempTokenRefreshed = false;
                return response.status(400).json({
                    post: index_1.posts[thisPostIndex],
                    tempToken
                });
            }
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
router.delete('/post/delete/:postId', Token_1.default, (request, response) => {
    const { tempToken } = request.body;
    const { postId } = request.params;
    const userIndex = (0, Search_1.default)('tempToken', tempToken);
    const thisPostIndex = (0, Search_1.default)('post', postId);
    if (userIndex >= 0) {
        if (thisPostIndex >= 0) {
            if (index_1.posts[thisPostIndex].userId === index_1.users[userIndex].id) {
                index_1.posts.splice(thisPostIndex, 1);
                if (index_1.users[userIndex].tempTokenRefreshed) {
                    index_1.users[userIndex].tempTokenRefreshed = false;
                    return response.status(200).json({
                        tempToken
                    });
                }
                return response.sendStatus(204);
            }
            else {
                if (index_1.users[userIndex].tempTokenRefreshed) {
                    index_1.users[userIndex].tempTokenRefreshed = false;
                    return response.status(403).json({
                        mensagem: "Apenas o criador do post pode excluí-lo.",
                        tempToken
                    });
                }
                return response.status(403).json({
                    mensagem: "Apenas o criador do post pode excluí-lo."
                });
            }
        }
        else {
            if (index_1.users[userIndex].tempTokenRefreshed) {
                index_1.users[userIndex].tempTokenRefreshed = false;
                return response.status(400).json({
                    mensagem: `Infelizmente não encontramos nenhum post com o id ${postId}.`,
                    tempToken
                });
            }
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
