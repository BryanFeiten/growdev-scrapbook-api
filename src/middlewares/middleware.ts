import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { SECRET_KEY } from '../index';

import { users } from '../index';
import { validToken } from '../index';

export function verifyFieldsValues(request: Request, response: Response, next: NextFunction) {
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

export async function checkUserIndexExists(email: string, password: string) {
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

export function validateToken(request: Request, response: Response, next: NextFunction) {
    const { token } = request.body;

    if (token) {
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

export function checkEnvironmentVariables(request: Request, response: Response, next: NextFunction) {
    if(SECRET_KEY !== 'INVALID KEY') {
        next()
    } else {
        return response.status(401).json({
            message: "Variáveis de ambiente incorretas. Fique tranquilo que nossa equipe já está cuidando disso. :)"
        })
    }
}