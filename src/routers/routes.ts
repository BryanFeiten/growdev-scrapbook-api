import express, { Request, response, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import User from '../classes/User';
import Post from '../classes/Post';
import { postValidation, searchIndex } from '../controllers/rules';
import { verifyFieldsValues, checkUserIndexExists, checkForLogin, verifyToken, checkEnvironmentVariables } from '../middlewares/middleware';
import { users, posts, SECRET_KEY } from '../index';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());
router.use(cors());
router.use(checkEnvironmentVariables);

router.get('/', (request: Request, response: Response) => {
    return response.status(200).json("API running...");
});

router.get('/data', verifyToken, (request: Request, response: Response) => {

    return response.status(200).json({
        users,
        posts
    })
})

router.get('/users', verifyToken, (request: Request, response: Response) => {

    const showUsersLikethis: any[] = [];
    users.map(user => showUsersLikethis.push({
        Nome: `${user.firstName} ${user.lastName}`,
        Idade: user.age
    }))
    return response.status(200).json(showUsersLikethis);
});

router.post('/user/registration', verifyFieldsValues, async (request: Request, response: Response) => {
    const { firstName, lastName, gender, email, password, age, phone } = request.body;
    const userAlreadyExists = searchIndex('userEmail', email);
    if (userAlreadyExists === -1) {
        if (firstName && lastName && gender && email && password && age && phone) {
            const newUser = new User(firstName, lastName, gender, email, phone, await bcrypt.hash(password, 10), age);
            users.push(newUser);
            return response.status(201).json(newUser);
        }
    } else {
        return response.status(409).json({
            mensagem: "O e-mail já está cadastrado na plataforma."
        })
    }
});

router.post('/user/auth', async (request: Request, response: Response) => {
    const { email, password } = request.body;

    try {
        const userIndexFinded = await checkForLogin(email, password);
        if (userIndexFinded !== -1) {
            let mensagem = "Login efetuado com sucesso!"

            if (users[userIndexFinded].token) {
                mensagem = "Você foi desconectado de outra sessão, e seu login foi efetuado com sucesso!"
            }
            const token = jwt.sign({ token: users[userIndexFinded].setToken(request.ip) }, SECRET_KEY, { expiresIn: "57600000" });
            const tempToken = jwt.sign({ tempToken: users[userIndexFinded].refreshToken() }, SECRET_KEY, { expiresIn: "300000" });

            response.cookie('token', token, { maxAge: 57600000, httpOnly: true });
            response.cookie('tempToken', tempToken, { maxAge: 300000, httpOnly: true });

            return response.status(200).json({
                mensagem
            });
        } else {
            return response.status(401).json({
                mensagem: "Usuário ou senha inválidos. Por favor verifique e tente novamente!"
            });
        }
    } catch (error) {
        return response.status(400).json(error);
    }
})

router.post('/user/logout', verifyToken, (request: Request, response: Response) => {
    const token = request.cookies.token;
    const userIndex = searchIndex('token', token);

    if (userIndex >= 0) {
        users[userIndex].setLogout();
        response.cookie('token', '');
        response.cookie('tempToken', '');

        return response.sendStatus(204);
    } else {
        return response.status(401).json("Você não está logado.")
    }
})

router.get('/posts', verifyToken, async (request: Request, response: Response) => {
    const token = request.cookies.token;
    const userIndexFinded = searchIndex('token', token);

    if (userIndexFinded === -1) {
        return response.status(401).json({
            mensagem: "Você precisa logar."
        });
    }

    const showThisPosts = posts.filter(post => post.postPrivacity === 'public' || post.userId === users[userIndexFinded].id);

    return response.status(200).json(showThisPosts);
})

router.get('/post/:postId', verifyToken, async (request: Request, response: Response) => {
    const token = request.cookies.token;
    const { postId } = request.params;
    const postIndex = posts.findIndex(post => post.id === postId);
    const userIndexFinded = searchIndex('token', token);

    if (userIndexFinded === -1) {
        return response.status(401).json({
            mensagem: "Você precisa logar."
        });
    }

    if (postIndex === -1) {
        return response.status(400).json({
            mensagem: `Infelizmente não encontramos nenhum post com o id ${postId}` ,
        })
    }

    const postAuth = posts[postIndex].userId === users[userIndexFinded].id ? true : false;

    if (postAuth === true || posts[postIndex].postPrivacity === 'public') {
        return response.status(200).json(posts[postIndex]);
    } else {
        return response.status(403).json({
            mensagem: "Somente o autor de um post privado pode consultá-lo."
        });
    }
})

router.post('/post/create', verifyToken, (request: Request, response: Response) => {
    const token = request.cookies.token;
    const { postHeader, postContent, postPrivacity } = request.body;
    const userIndexFinded = searchIndex('token', token);

    const { validPost, message } = postValidation(postHeader, postContent, postPrivacity);

    if (token && userIndexFinded >= 0) {
        if (validPost === true) {
            const newPost = new Post(users[userIndexFinded].id, postHeader, postContent, postPrivacity);
            posts.push(newPost);

            return response.status(201).json(newPost);
        } else {
            return response.status(400).json({
                message
            })
        }
    } else {
        return response.status(401).json({
            mensagem: "Você precisa logar."
        })
    }
})

router.put('/post/modify/:postId', verifyToken, (request: Request, response: Response) => {
    const token = request.cookies.token;
    const { postId } = request.params;
    const { newPostHeader, newPostContent, newPostPrivacity } = request.body;

    const userIndexFinded = searchIndex('token', token);
    const thisPostIndex = searchIndex('post', postId);

    const { validPost, message } = postValidation(newPostHeader, newPostContent, newPostPrivacity);

    if (userIndexFinded >= 0) {
        if (thisPostIndex >= 0) {
            if (posts[thisPostIndex].userId === users[userIndexFinded].id) {
                if (validPost === true) {
                    posts[thisPostIndex].setPostHeader(newPostHeader);
                    posts[thisPostIndex].setPostContent(newPostContent);
                    posts[thisPostIndex].setPrivacity(newPostPrivacity);
                    return response.status(200).json(posts[thisPostIndex]);
                } else {
                    return response.status(400).json({
                        message
                    })
                }
            } else {
                return response.status(403).json({
                    mensagem: "Apenas o criador do post pode alterar o conteúdo do mesmo."
                })
            }
        } else {
            return response.status(400).json({
                mensagem: `Infelizmente não encontramos nenhum post com o id ${postId}.`
            })
        }
    } else {
        return response.status(401).json({
            mensagem: "Você precisa logar."
        })
    }
})

router.delete('/post/delete/:postId', verifyToken, (request: Request, response: Response) => {
    const token = request.cookies.token;
    const { postId } = request.params;
    const userIndexFinded = searchIndex('token', token);
    const thisPostIndex = searchIndex('post', postId);

    if (userIndexFinded >= 0) {
        if (thisPostIndex >= 0) {
            if (posts[thisPostIndex].userId === users[userIndexFinded].id) {
                posts.splice(thisPostIndex, 1);
                return response.sendStatus(204);
            } else {
                return response.status(403).json({
                    mensagem: "Apenas o criador do post pode excluí-lo."
                })
            }
        } else {
            return response.status(400).json({
                mensgem: `Infelizmente não encontramos nenhum post com o id ${postId}.`
            })
        }
    } else {
        return response.status(201).json({
            mensagem: "Você precisa logar."
        })
    }
})

export default router;