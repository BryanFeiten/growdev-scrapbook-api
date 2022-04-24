import express, { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import cors from 'cors';

import User from '../classes/User';
import Post from '../classes/Post';
import { users, posts } from '../index';
import protectRoute from '../middlewares/ProtectRoute';
import checkEnvironmentVariables from '../middlewares/Environment';
import verifyToken from '../middlewares/Token';
import verifyFieldsValues from '../middlewares/Registration';

import checkLogin from '../utils/Register';
import searchIndex from '../utils/Search';
import postValidation from '../utils/Post';

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cors());
router.use(checkEnvironmentVariables);

router.get('/', (request: Request, response: Response) => {
    return response.status(200).json("API running...");
});

router.post('/token', verifyToken, (request: Request, response: Response) => {
    
    return response.status(200).json({
        mensagem: "Token Ok"
    });
});

router.get('/protect/:key', protectRoute,(request: Request, response: Response) => {
    return response.json({
        users,
        posts
    })
})

router.get('/users', verifyToken, (request: Request, response: Response) => {
    const { token } = request.body;
    const userIndex = searchIndex('token', token);
    const showUsersLikethis: any[] = [];
    users.map(user => showUsersLikethis.push({
        Nome: `${user.firstName} ${user.lastName}`,
        Idade: user.age
    }))
    
    return response.status(200).json({
        showUsersLikethis: showUsersLikethis
    });
});

router.post('/user/registration', verifyFieldsValues, async (request: Request, response: Response) => {
    const { firstName, lastName, gender, email, password, age, phone } = request.body;
    const userAlreadyExists = searchIndex('userEmail', email);
    if (userAlreadyExists === -1) {
        if (firstName && lastName && gender && email && password && age && phone) {
            const newUser = new User(firstName, lastName, gender, email, phone, await bcrypt.hash(password, 10), age);
            users.push(newUser);

            return response.status(201).json({
                newUser,
                mensagem: "Usuário criado com sucesso. Você será redirecionado para a tela de login! (:"
            });
        }
        return response.status(400).json({
            mensagem: 'Você deve enviar todos os campos solicitados'
        })
    } else {
        return response.status(400).json({
            mensagem: "O e-mail já está cadastrado na plataforma."
        })
    }
});

router.post('/user/auth', async (request: Request, response: Response) => {
    const { email, password } = request.body;

    try {
        const userIndexFinded = await checkLogin(email, password);
        if (userIndexFinded !== -1) {
            let mensagem = "Login efetuado com sucesso!"

            if (users[userIndexFinded].token.signToken) {
                mensagem = "Você foi desconectado de outra sessão, e seu login foi efetuado com sucesso!"
            }
            const token = users[userIndexFinded].setLogin();
            return response.status(200).json({
                mensagem,
                token
            });

        }

        return response.status(401).json({
            mensagem: "Usuário ou senha inválidos. Por favor verifique e tente novamente!"
        });

    } catch (error) {
        return response.status(401).json({
            mensagem: "Usuário ou senha inválidos."
        });
    }
})

router.post('/user/logout', verifyToken, (request: Request, response: Response) => {
    const { token } = request.body;
    const userIndex = searchIndex('token', token);

    if (userIndex >= 0) {
        users[userIndex].setLogout();

        return response.sendStatus(204);
    }

        return response.status(401).json("Você não está logado.");
})

router.post('/posts', verifyToken, async (request: Request, response: Response) => {
    const { token } = request.body;
    const userIndex = searchIndex('token', token);

    if (userIndex === -1) {
        return response.status(401).json({
            mensagem: "Você precisa logar."
        });
    }

    const showThisPosts = posts.filter(post => post.postPrivacity === 'public' || post.userId === users[userIndex].id);

    return response.status(200).json({
        id: users[userIndex].id,
        showThisPosts: showThisPosts
    });
})

router.post('/post/search/:postId', verifyToken, async (request: Request, response: Response) => {
    const { token } = request.body;
    const { postId } = request.params;
    const postIndex = posts.findIndex(post => post.id === postId);
    const userIndex = searchIndex('token', token);

    if (userIndex === -1) {
        return response.status(401).json({
            mensagem: "Você precisa logar."
        });
    }

    if (postIndex === -1) {

        return response.status(400).json({
            mensagem: `Infelizmente não encontramos nenhum post com o id ${postId}`
        })
    }

    const postAuth = posts[postIndex].userId === users[userIndex].id ? true : false;

    if (postAuth === true || posts[postIndex].postPrivacity === 'public') {

        return response.status(200).json({
            post: posts[postIndex]
        });
    }

    return response.status(403).json({
        mensagem: "Somente o autor de um post privado pode consultá-lo."
    });
    
})

router.post('/post/create', verifyToken, (request: Request, response: Response) => {
    const { postHeader, postContent, postPrivacity, token } = request.body;
    const userIndex = searchIndex('token', token);

    const { validPost, message } = postValidation(postHeader, postContent, postPrivacity);

    if (token && userIndex >= 0) {
        if (validPost === true) {
            const newPost = new Post(users[userIndex].id, `${users[userIndex].firstName}`, `${users[userIndex].lastName}`, postHeader, postContent, postPrivacity);
            posts.push(newPost);

            return response.status(201).json({
                newPost: newPost
            });
        } else {

            return response.status(400).json({
                mensagem: message
            })
        }
    } else {

        return response.status(401).json({
            mensagem: "Você precisa logar."
        })
    }
})

router.put('/post/modify/:postId', verifyToken, (request: Request, response: Response) => {
    const { postId } = request.params;
    const { newPostHeader, newPostContent, newPostPrivacity, token } = request.body;

    const userIndex = searchIndex('token', token);
    const thisPostIndex = searchIndex('post', postId);

    const { validPost, message } = postValidation(newPostHeader, newPostContent, newPostPrivacity);

    if (userIndex >= 0) {
        if (thisPostIndex >= 0) {
            if (posts[thisPostIndex].userId === users[userIndex].id) {
                if (validPost === true) {
                    posts[thisPostIndex].setPostHeader(newPostHeader);
                    posts[thisPostIndex].setPostContent(newPostContent);
                    posts[thisPostIndex].setPrivacity(newPostPrivacity);

                    return response.status(200).json({
                        post: posts[thisPostIndex]
                    });
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
    }
        
    return response.status(401).json({
        mensagem: "Você precisa logar."
    })
})

router.delete('/post/delete/:postId', verifyToken, (request: Request, response: Response) => {
    const { token } = request.body;
    const { postId } = request.params;
    const userIndex = searchIndex('token', token);
    const thisPostIndex = searchIndex('post', postId);

    if (userIndex >= 0) {
        if (thisPostIndex >= 0) {
            if (posts[thisPostIndex].userId === users[userIndex].id) {
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
    } 

    return response.status(201).json({
        mensagem: "Você precisa logar."
    })
})

export default router;
