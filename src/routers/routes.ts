import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import User from '../classes/User';
import Post from '../classes/Post';
import { postValidation, searchIndex } from '../controllers/rules';
import { verifyFieldsValues, checkUserIndexExists, validateToken, checkEnvironmentVariables } from '../middlewares/middleware';
import { users, posts, validToken, invalidToken, SECRET_KEY, userTryInvalidToken } from '../index';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(cors());
router.use(checkEnvironmentVariables);

router.get('/', (request: Request, response: Response) => {
    return response.status(200).json("API running...");
});

router.get('/testUsers', (request: Request, response: Response) => {
    return response.status(200).json({
        users,
        posts
    })
})

router.get('/users', validateToken, (request: Request, response: Response) => {
    const { token } = request.body;
    if (token) {
        const showUsersLikethis: any[] = [];
        users.map(user => showUsersLikethis.push({
            Nome: `${user.firstName} ${user.lastName}`,
            Idade: user.age
        }))
        return response.status(200).json(showUsersLikethis);
    } else {
        return response.status(401).json({
            mensagem: "Faça o login."
        })
    }
});

router.post('/registration', verifyFieldsValues, async (request: Request, response: Response) => {
    const { firstName, lastName, gender, email, password, age, phone } = request.body;
    const userAlreadyExists = await checkUserIndexExists(email, password);
    if (userAlreadyExists === -1) {
        if (firstName && lastName && gender && email && password && age && phone) {
            const newUser = new User(firstName, lastName, gender, email, phone, await bcrypt.hash(password, 10), age);
            users.push(newUser);
            return response.json(newUser);
        }
    } else {
        return response.json({
            mensagem: "O e-mail já está cadastrado na plataforma."
        })
    }
});

router.post('/login', async (request: Request, response: Response) => {
    const { email, password } = request.body;
    try {
        const userIndexFinded = await checkUserIndexExists(email, password);
        if (userIndexFinded !== -1) {
            const tokenIndexAlreadyValid = validToken.findIndex(token => token === users[userIndexFinded].token);
            const tokenIndexAlreadyInvalid = invalidToken.findIndex(token => token === users[userIndexFinded].token);
            if (tokenIndexAlreadyValid === -1 && tokenIndexAlreadyInvalid === -1) {
                const token = await jwt.sign(users[userIndexFinded].id, SECRET_KEY);
                users[userIndexFinded].setToken(token);
                validToken.push(token);
                return response.json({
                    mensagem: "Login efetuado com sucesso! Use o token abaixo para solicitar os serviços da API.",
                    token
                });
            } else if (tokenIndexAlreadyValid !== -1 && tokenIndexAlreadyInvalid === -1) {
                return response.json({
                    mensagem: "Você já está logado."
                })
            } else {
                userTryInvalidToken.push(users[userIndexFinded]);
                users.splice(userIndexFinded, 1);
                return response.json({
                    mensagem: "O token de seu usuário é inválido. Você está sendo removido da rede por tentativa de burlar o sistema. Á partir de hoje, seu email consta em nossa lista de tentativas de fraude."
                })
            }
        } else {
            return response.sendStatus(401);
        }
    } catch (error) {
        return response.status(400).json(error);
    }
})

router.post('/logout', validateToken, (request: Request, response: Response) => {
    const { token } = request.body;
    const tokenIndex = validToken.findIndex(tokenCompare => tokenCompare === token);
    const userIndex = searchIndex('user', token);

    if (tokenIndex >= 0) {
        invalidToken.push(token);
        validToken.splice(tokenIndex, 1);
        return response.json({
            mensagem: "Sucesso no Logout!"
        });
    } else {
        return response.json("Seu token é inválido.")
    }
})

router.get('/posts', validateToken, async (request: Request, response: Response) => {
    const { token } = request.body;
    const userIndexFinded = searchIndex('user', token);
    
    if (userIndexFinded === -1) {
        return response.json({
            mensagem: "Você precisa logar."
        });
    }

    const showThisPosts = posts.filter(post => post.postPrivacity === 'public' || post.userId === users[userIndexFinded].id);

    return response.json(showThisPosts);
})


router.post('/posts', validateToken, (request: Request, response: Response) => {
    const { token, postHeader, postContent, postPrivacity } = request.body;
    const userIndexFinded = searchIndex('user', token);
    console.log(userIndexFinded);

    const { validPost, message } = postValidation(postHeader, postContent, postPrivacity);

    if (token && userIndexFinded >= 0) {
        if (validPost === true) {
            const newPost = new Post(users[userIndexFinded].id, postHeader, postContent, postPrivacity);
            posts.push(newPost);

            return response.json(posts);
        } else {
            return response.json({
                message
            })
        }
    } else {
        return response.json({
            mensagem: "Você precisa logar."
        })
    }
})

router.put('/posts', validateToken, (request: Request, response: Response) => {
    const { token, postId, newPostHeader, newPostContent, newPostPrivacity } = request.body;

    const userIndexFinded = searchIndex('user', token);
    const thisPostIndex = searchIndex('post', postId);

    const { validPost, message } = postValidation(newPostHeader, newPostContent, newPostPrivacity);

    if (userIndexFinded >= 0) {
        if (thisPostIndex >= 0) {
            if (posts[thisPostIndex].userId === users[userIndexFinded].id) {
                if (validPost === true) {
                    posts[thisPostIndex].setPostHeader(newPostHeader);
                    posts[thisPostIndex].setPostContent(newPostContent);
                    posts[thisPostIndex].setPrivacity(newPostPrivacity);
                    return response.json(posts[thisPostIndex]);
                } else {
                    return response.json({
                        message
                    })
                }
            } else {
                return response.json({
                    mensagem: "Apenas o criador do post pode alterar o conteúdo do mesmo."
                })
            }
        } else {
            return response.json({
                mensagem: `Infelizmente não encontramos nenhum post com o id ${postId}.`
            })
        }
    } else {
        return response.json({
            mensagem: "Você precisa logar."
        })
    }
})

router.delete('/posts', validateToken, (request: Request, response: Response) => {
    const { token, postId } = request.body;
    const userIndexFinded = searchIndex('user', token);
    const thisPostIndex = searchIndex('post', postId);

    if (userIndexFinded >= 0) {
        if (thisPostIndex >= 0) {
            if (posts[thisPostIndex].userId === users[userIndexFinded].id) {
                posts.splice(thisPostIndex, 1);
                return response.sendStatus(204);
            } else {
                return response.json({
                    mensagem: "Apenas o criador do post pode excluí-lo."
                })
            }
        } else {
            return response.json({
                mensgem: `Infelizmente não encontramos nenhum post com o id ${postId}.`
            })
        }
    } else {
        return response.json({
            mensagem: "Você precisa logar."
        })
    }
})

export default router;