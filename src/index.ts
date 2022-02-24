import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import User from './classes/User';
export const SECRET_KEY = 'fp072307';

const app = express();
const PORT = process.env.PORT || 5000;
export const users: User[] = [];
const validToken: string[] = [];
const invalidToken: string[] = [];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (request: Request, response: Response) => {
    return response.status(200).json("API Running");
});

app.get('/users', async (request: Request, response: Response) => {
    const { email, password } = request.body;
    if (email && password) {
        try {
            const userIndexFinded = users.findIndex(user => user.email === email);
            const comparePassword = await bcrypt.compare(password, users[userIndexFinded].getPassword);
            const tokenExist = users[userIndexFinded].token;
            if (userIndexFinded !== -1 && comparePassword && tokenExist !== '') {
                return response.status(200).json(users)
            } else {
                return response.sendStatus(401);
            }
        } catch (error) {
            return response.sendStatus(404);
        }
    }

    return response.sendStatus(404);
});

app.post('/users', async (request: Request, response: Response) => {
    const { firstName, lastName, gender, email, password, age, phone } = request.body;
    const userAlready = await verifyAlreadyUser(email, password);
    if(userAlready === -1) {
        if (firstName && lastName && gender && email && password && age && phone) {
            const newUser = new User(firstName, lastName, gender, email, await bcrypt.hash(password, 10), age, phone);
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
        const userIndexFinded = users.findIndex(user => user.email === email);
        const comparePassword = await bcrypt.compare(password, users[userIndexFinded].getPassword);
        if (userIndexFinded !== -1 && comparePassword) {
            const token = await jwt.sign(users[userIndexFinded].id, SECRET_KEY);
            users[userIndexFinded].setToken(token);
            validToken.push(token);
            return response.json({
                mensagem: "logado!",
                token
            });
        } else {
            return response.sendStatus(401);
        }
    } catch (error) {
        return response.status(400).json(error);
    }
})

function verifyAlreadyUser(email: string, password:string): number {
    try {
        const userIndex = users.findIndex(user => user.email === email);
        const verifyPassword = bcrypt.compare(password, users[userIndex].getPassword);
        if(userIndex !== -1 && verifyPassword) {
            return userIndex;
        }
        return -1;
    } catch (error) {
        return -1
    }
}

// Passar esta funcção para o restante das rotas.

app.post('/logout', async (request: Request, response: Response) => {
    const { email, password } = request.body;
    try {
        if(email && password) {
            const userIndex = await verifyAlreadyUser(email, password)
            const token = users[userIndex].token;
            const tokenIndex = validToken.findIndex(token => users[userIndex].token === token)
            if(userIndex !== -1 && jwt.verify(token, SECRET_KEY) && tokenIndex !== -1) {
                invalidToken.push(token);
                validToken.splice(tokenIndex, 1);
                users[userIndex].setToken('');
                return response.json({
                    mensagem: "Sucesso no Logout!"
                });
            } else {
                return response.status(401).json({
                    mensagem: "Não há como fazer logout se você não está logado."
                })
            }
        } else {
            return response.status(401).json({
                mensagem: "Por favor insira um email e senha."
            });
        }
    } catch (error) {
        return response.sendStatus(404);
    }
})

app.post('/check-token', async (request: Request, response: Response) => {
    const { email, password } = request.body;

    try {
        const userIndexFinded = users.findIndex(user => user.email === email);
        const comparePassword = await bcrypt.compare(password, users[userIndexFinded].getPassword);
        if (userIndexFinded !== -1 && comparePassword) {
            const token = users[userIndexFinded].token;
            if (token) {
                jwt.verify(token, SECRET_KEY)
                    ? response.json("Token Ok")
                    : response.json("Token Inválido");
            } else {
                return response.status(401).json("Faça o login");
            }
        }
    } catch (error) {
        return response.json(error);
    }
})



app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));