import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import User from './classes/User';
import Post from './classes/Post';
import dotenv from 'dotenv';
dotenv.config();

export const SECRET_KEY = process.env.SECRET_KEY || 'No key';

const app = express();
const PORT = process.env.PORT || 5000;
export const users: User[] = [];
export const posts: Post[] = [];
const userTryInvalidToken: User[] = [];
const validToken: string[] = [];
const invalidToken: string[] = [];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

async function checkUserIndexExists(email: string, password: string) {
    try {
        const userIndex = users.findIndex(user => user.email === email);
        const verifyPassword = await bcrypt.compare(password, users[userIndex].getPassword);

        if (userIndex !== -1 && verifyPassword) {
            return userIndex;
        } else {
            return -1;
        }
    } catch (error) {
        return -1
    }
}

function verifyFieldsValues(request: Request, response: Response, next: NextFunction) {
    const { firstName, lastName, gender, email, password, age, phone } = request.body;
    let mensagem = '';
    let error = false;
    switch (true) {
        case firstName.length < 3:
            mensagem = 'Seu primeiro nome deve conter pelo menos 3 letras.';
            error = true;
            break
        case lastName.length < 2:
            mensagem = 'Seu último nome deve conter pelo menos 2 letras.';
            error = true;
            break
        case gender !== 'masculine' && gender !== 'femine' && gender !== 'non-binary':
            mensagem = 'Por favor insira um gênero válido.';
            error = true;
            break
        case email.indexOf("@") === -1 || email.indexOf('.com') === -1:
            mensagem = 'Por favor insira um e-mail válido.';
            error = true;
            break
        case age < 18:
            mensagem = `Infelizmente pessoas menores de idade não podem ter conta na plataforma. retorne após ${(age - 18) * (-1)} ano(s).`;
            error = true;
            break
    }
    if (error) {
        return response.status(400).json(mensagem);
    } else {
        next()
    }
}

function validateToken(request: Request, response: Response, next: NextFunction) {
    const { token } = request.body;
    if(token) {
        const tokenIndex = validToken.findIndex(tokenCompare => tokenCompare === token);

        if (tokenIndex >= 0 && jwt.verify(token, SECRET_KEY)) {
            next();
        } else {
            return response.status(401).json({
                mensagem: "Seu token é inválido."
            })
        }
    } else {
        return response.status(401).json({
            mensagem: "Por favor envie um token no body da requisição."
        })
    }
}

app.get('/', (request: Request, response: Response) => {
    return response.status(200).json("API running...");
});

app.get('/testUsers', (request: Request, response: Response) => {
    return response.status(200).json({
        users,
        posts
    })
})

app.get('/users', validateToken, (request: Request, response: Response) => {
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

app.post('/registration', verifyFieldsValues, async (request: Request, response: Response) => {
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

app.post('/login', async (request: Request, response: Response) => {
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

app.post('/logout', validateToken, (request: Request, response: Response) => {
    const { token } = request.body;
    const tokenIndex = validToken.findIndex(tokenCompare => tokenCompare === token);
    const userIndex = users.findIndex(user => user.token === token);

    if(tokenIndex >= 0) {
        invalidToken.push(token);
        validToken.splice(tokenIndex, 1);
        users[userIndex].setToken('');
        return response.json({
            mensagem: "Sucesso no Logout!"
        });
    } else {
        return response.json("Seu token é inválido.")
    }
})

app.get('/posts', validateToken, async (request: Request, response: Response) => {
    const { token } = request.body;
    const userIndexFinded = await users.findIndex(user => user.token === token);
    if (userIndexFinded === -1) {
        return response.json({
            mensagem: "Você precisa logar."
        });
    }

    const showThisPosts = posts.filter(post => post.postPrivacity === 'public' || post.user.id === users[userIndexFinded].id);

    return response.json(showThisPosts);
})

app.post('/posts', validateToken, (request: Request, response: Response) => {
    const { token, postHeader, postContent, postPrivacity } = request.body;
    const userIndexFinded = users.findIndex(user => user.token === token);

    if (token && userIndexFinded >= 0) {
        if (postHeader && postContent && postPrivacity) {
            if (postHeader.length >= 3 && postContent.length >= 4) {
                if (postPrivacity === 'private' || postPrivacity === 'public') {
                    const newPost = new Post(users[userIndexFinded], postHeader, postContent, postPrivacity);
                    posts.push(newPost);
    
                    return response.json(posts);
                } else {
                    return response.json({
                        mensagem: "Por favor, escolha a privacidade do seu post."
                    })
                }
            } else {
                return response.json({
                    mensagem: "Você precisa preencher os campos de cabeçalho e conteúdo.",
                    requisitos: "Cabeçalho com 3 letras no mínimo, Conteúdo com 4 letras."
                })
            }
        } else {
            return response.json({
                mensagem: "Você precisa enviar os dados solicitados."
            })
        }
    } else {
        return response.json({
            mensagem: "Você precisa logar."
        })
    }    
})

app.put('/posts', validateToken, (request: Request, response: Response) => {
    const { token, postId, newPostHeader, newPostContent, newPostPrivacity } = request.body;

    const userIndexFinded = users.findIndex(user => user.token === token);

    if (userIndexFinded >= 0) {
        const thisPostIndex = posts.findIndex(post => post.id === postId);
        if (thisPostIndex >= 0) {
            if (posts[thisPostIndex].user.id === users[userIndexFinded].id) {
                if (newPostHeader && newPostContent && newPostPrivacity) {
                    if (newPostHeader.length >= 3 && newPostContent.length >= 4) {
                        if (newPostPrivacity === 'private' || newPostPrivacity === 'public') {
                            posts[thisPostIndex].setPostHeader(newPostHeader);
                            posts[thisPostIndex].setPostContent(newPostContent);
                            posts[thisPostIndex].setPrivacity(newPostPrivacity);
                            return response.json(posts[thisPostIndex]);
                        } else {
                            return response.json({
                                mensagem: "Por favor, escolha a privacidade do seu post."
                            })
                        }
                    } else {
                        return response.json({
                            mensagem: "Você precisa preencher os campos de cabeçalho e conteúdo.",
                            requisitos: "Cabeçalho com 3 letras no mínimo, Conteúdo com 4 letras."
                        })
                    }
                } else {
                    return response.json({
                        mensagem: "Você precisa enviar os dados solicitados."
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

app.delete('/posts', validateToken, (request: Request, response: Response) => {
    const { token, postId } = request.body;
    const userIndexFinded = users.findIndex(user => user.token === token);

    if (userIndexFinded >= 0) {
        const thisPostIndex = posts.findIndex(post => post.id === postId);
        if (thisPostIndex >= 0) {
            if (posts[thisPostIndex].user.id !== users[userIndexFinded].id) {
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

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));