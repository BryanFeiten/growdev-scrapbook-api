import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { SECRET_KEY } from '../index';

import { users } from '../index';
import { searchIndex } from '../controllers/rules';

export function verifyFieldsValues(request: Request, response: Response, next: NextFunction) {
    const { firstName, lastName, gender, email, age } = request.body;
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

export function checkUserIndexExists(email:string) {
    const userIndex = users.findIndex(user => user.email === email);
    
    return userIndex;
}

export async function checkForLogin(email: string, password: string) {
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

export async function verifyToken(request: Request, response: Response, next: NextFunction) {
    const temptoken = request.cookies.tempToken;
    const token = request.cookies.token;

    if (!token) {
        return response.status(401).json({
            mensagem: "Faça seu login!"
        })
    }

    const userIndex = searchIndex('token', token);

    if (userIndex < 0) {
        return response.status(403).json({
            mensagem: "Token inválido."
        })
    }

    jwt.verify(temptoken, SECRET_KEY, { complete: true }, error => {
        if (error) {
            jwt.verify(token, SECRET_KEY, { complete: true }, err => {
                if (err) {
                    return response.status(403).json({
                        mensagem: "Seu acesso expirou. Faça o login novamente."
                    })
                } else {
                    const refreshToken = users[userIndex].refreshToken();
                    const tempToken = jwt.sign({ refreshToken }, SECRET_KEY, { expiresIn: "300000" });
                    response.cookie('tempToken', tempToken, { maxAge: 300000, httpOnly: true });
                }
            })
        }
    });

    next();
}

export function checkEnvironmentVariables(request: Request, response: Response, next: NextFunction) {
    if (SECRET_KEY !== 'INVALID KEY') {
        next()
    } else {
        return response.status(401).json({
            message: "Variáveis de ambiente incorretas. Fique tranquilo que nossa equipe já está cuidando disso. :)"
        })
    }
}