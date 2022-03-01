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
exports.posts = exports.users = exports.SECRET_KEY = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const User_1 = __importDefault(require("./classes/User"));
const Post_1 = __importDefault(require("./classes/Post"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.SECRET_KEY = process.env.SECRET_KEY || 'erro no dotenv';
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
exports.users = [];
exports.posts = [];
const validToken = [];
const invalidToken = [];
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
async function checkUserIndexExists(email, password) {
    try {
        const userIndex = exports.users.findIndex(user => user.email === email);
        const verifyPassword = await bcrypt.compare(password, exports.users[userIndex].getPassword);
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
async function verifyFieldsForLogin(request, response, next) {
    const { email, password } = request.body;
    try {
        const userIndex = exports.users.findIndex(user => user.email === email);
        if (userIndex !== -1 && password) {
            const verifyPassword = await bcrypt.compare(password, exports.users[0].getPassword);
            if (verifyPassword) {
                next();
            }
            else {
                return response.json({
                    mensagem: "Usuário ou senha incorretos."
                });
            }
        }
        else {
            return response.json({
                mensagem: "Usuário ou senha incorretos."
            });
        }
    }
    catch (error) {
        return response.json("Erro");
    }
}
function verifyFieldsValues(request, response, next) {
    const { firstName, lastName, gender, email, password, age, phone } = request.body;
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
app.get('/', (request, response) => {
    return response.status(200).json("API Running");
});
app.get('/users', verifyFieldsForLogin, async (request, response) => {
    const { email, password } = request.body;
    if (email && password) {
        const userIndexFinded = await checkUserIndexExists(email, password);
        const token = exports.users[userIndexFinded].token;
        if (token !== '') {
            const showUsersLikethis = [];
            exports.users.map(user => showUsersLikethis.push({
                Nome: `${user.firstName} ${user.lastName}`,
                Idade: user.age
            }));
            return response.status(200).json(showUsersLikethis);
        }
        else {
            return response.status(401).json({
                mensagem: "Faça o login."
            });
        }
    }
});
app.post('/registration', verifyFieldsValues, async (request, response) => {
    const { firstName, lastName, gender, email, password, age, phone } = request.body;
    const userAlreadyExists = await checkUserIndexExists(email, password);
    if (userAlreadyExists === -1) {
        if (firstName && lastName && gender && email && password && age && phone) {
            const newUser = new User_1.default(firstName, lastName, gender, email, phone, await bcrypt.hash(password, 10), age);
            exports.users.push(newUser);
            return response.json(newUser);
        }
    }
    else {
        return response.json({
            mensagem: "O e-mail já está cadastrado na plataforma."
        });
    }
});
app.post('/login', verifyFieldsForLogin, async (request, response) => {
    const { email, password } = request.body;
    try {
        const userIndexFinded = await checkUserIndexExists(email, password);
        if (userIndexFinded !== -1) {
            const token = await jsonwebtoken_1.default.sign(exports.users[userIndexFinded].id, exports.SECRET_KEY);
            exports.users[userIndexFinded].setToken(token);
            validToken.push(token);
            return response.json({
                mensagem: "logado!",
                token
            });
        }
        else {
            return response.sendStatus(401);
        }
    }
    catch (error) {
        return response.status(400).json(error);
    }
});
app.post('/logout', async (request, response) => {
    const { email, password } = request.body;
    try {
        if (email && password) {
            const userIndex = await checkUserIndexExists(email, password);
            const token = exports.users[userIndex].token;
            const tokenIndex = validToken.findIndex(token => exports.users[userIndex].token === token);
            if (userIndex !== -1 && jsonwebtoken_1.default.verify(token, exports.SECRET_KEY) && tokenIndex !== -1) {
                invalidToken.push(token);
                validToken.splice(tokenIndex, 1);
                exports.users[userIndex].setToken('');
                return response.json({
                    mensagem: "Sucesso no Logout!"
                });
            }
            else {
                return response.status(401).json({
                    mensagem: "Não há como fazer logout se você não está logado."
                });
            }
        }
        else {
            return response.status(401).json({
                mensagem: "Por favor insira um email e senha."
            });
        }
    }
    catch (error) {
        return response.sendStatus(404);
    }
});
app.get('/posts', async (request, response) => {
    const { email, password } = request.body;
    const userIndexFinded = await checkUserIndexExists(email, password);
    if (userIndexFinded === -1) {
        return response.json({
            mensagem: "Crie um usuário."
        });
    }
    const tokenExist = exports.users[userIndexFinded].token;
    if (tokenExist === '') {
        return response.json({
            mensagem: "Você precisa logar."
        });
    }
    const showThisPosts = exports.posts.filter(post => post.postPrivacity === 'public' || post.user.id === exports.users[userIndexFinded].id);
    return response.json(showThisPosts);
});
app.post('/posts', async (request, response) => {
    const { email, password, postHeader, postContent, postPrivacity } = request.body;
    const userIndexFinded = await checkUserIndexExists(email, password);
    if (userIndexFinded === -1) {
        return response.status(401).json({
            mensagem: "Crie um usuário."
        });
    }
    const tokenExist = exports.users[userIndexFinded].token;
    if (tokenExist === '') {
        return response.json({
            mensagem: "Você precisa logar."
        });
    }
    if (postHeader && postContent && postPrivacity) {
        if (postHeader.length >= 3 && postContent.length >= 4) {
            if (postPrivacity === 'private' || postPrivacity === 'public') {
                const newPost = new Post_1.default(exports.users[userIndexFinded], postHeader, postContent, postPrivacity);
                exports.posts.push(newPost);
                return response.json(exports.posts);
            }
            else {
                return response.json({
                    mensagem: "Por favor, escolha a privacidade do seu post."
                });
            }
        }
        else {
            return response.json({
                mensagem: "Você precisa preencher os campos de cabeçalho e conteúdo.",
                requisitos: "Cabeçalho com 3 letras no mínimo, Conteúdo com 4 letras."
            });
        }
    }
    else {
        return response.json({
            mensagem: "Você precisa enviar os dados solicitados."
        });
    }
});
app.put('/posts', async (request, response) => {
    const { email, password, postId, newPostHeader, newPostContent, newPostPrivacity } = request.body;
    const userIndexFinded = await checkUserIndexExists(email, password);
    if (userIndexFinded === -1) {
        return response.json({
            mensagem: "Usuário não encontrado."
        });
    }
    const tokenExist = exports.users[userIndexFinded].token;
    if (tokenExist === '') {
        return response.json({
            mensagem: "Você precisa logar."
        });
    }
    const thisPostIndex = exports.posts.findIndex(post => post.id === postId);
    if (thisPostIndex === -1) {
        return response.json({
            mensgem: `Infelizmente não encontramos nenhum post com o id ${postId}.`
        });
    }
    if (exports.posts[thisPostIndex].user.id !== exports.users[userIndexFinded].id) {
        return response.json({
            mensagem: "Apenas o criador do post pode alterar o conteúdo do mesmo."
        });
    }
    if (newPostHeader && newPostContent && newPostPrivacity) {
        if (newPostHeader.length >= 3 && newPostContent.length >= 4) {
            if (newPostPrivacity === 'private' || newPostPrivacity === 'public') {
                exports.posts[thisPostIndex].setPostHeader(newPostHeader);
                exports.posts[thisPostIndex].setPostContent(newPostContent);
                exports.posts[thisPostIndex].setPrivacity(newPostPrivacity);
                return response.json(exports.posts[thisPostIndex]);
            }
            else {
                return response.json({
                    mensagem: "Por favor, escolha a privacidade do seu post."
                });
            }
        }
        else {
            return response.json({
                mensagem: "Você precisa preencher os campos de cabeçalho e conteúdo.",
                requisitos: "Cabeçalho com 3 letras no mínimo, Conteúdo com 4 letras."
            });
        }
    }
    else {
        return response.json({
            mensagem: "Você precisa enviar os dados solicitados."
        });
    }
});
app.delete('/posts', async (request, response) => {
    const { email, password, postId } = request.body;
    const userIndexFinded = await checkUserIndexExists(email, password);
    if (userIndexFinded === -1) {
        return response.json({
            mensagem: "Usuário não encontrado."
        });
    }
    const tokenExist = exports.users[userIndexFinded].token;
    if (tokenExist === '') {
        return response.json({
            mensagem: "Você precisa logar."
        });
    }
    const thisPostIndex = exports.posts.findIndex(post => post.id === postId);
    if (thisPostIndex === -1) {
        return response.json({
            mensgem: `Infelizmente não encontramos nenhum post com o id ${postId}.`
        });
    }
    if (exports.posts[thisPostIndex].user.id !== exports.users[userIndexFinded].id) {
        return response.json({
            mensagem: "Apenas o criador do post pode excluí-lo."
        });
    }
    exports.posts.splice(thisPostIndex, 1);
    return response.sendStatus(204);
});
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
