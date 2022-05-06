import { Request, Response, NextFunction, json } from 'express';
import { HttpBadRequestCode, invalidFieldMessage } from '../constants';
import jwt from "jsonwebtoken";
import { HttpUnauthorizedCode, unauthorizedMessage } from '../constants';
import 'dotenv/config';

export function loginFieldsValidator(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;

    if (!email || !password) return response.status(HttpBadRequestCode).json(invalidFieldMessage('Campo(s) de Email ou Senha'));

    switch (true) {
        case email.indexOf("@") === -1 || email.indexOf('.co') === -1 || email.length < 7:
            return response.status(HttpBadRequestCode).json({
                mensagem: invalidFieldMessage('Campo de e-mail')
            });

        case password.length < 6:
            return response.status(HttpBadRequestCode).json({
                mensagem: invalidFieldMessage('Campo de senha')
            });
    }

    next();
}

export function createUserFieldValidator(request: Request, response: Response, next: NextFunction) {
    const { username, fullName, gender, email, password } = request.body;

    if (!username || !fullName || !gender || !email || !password) return response.status(HttpBadRequestCode).json({
        mensagem: invalidFieldMessage('Campo(s) de registro não enviado(s)')
    });

    switch (true) {
        case username.length < 4:
            return response.status(HttpBadRequestCode).json({
                mensagem: invalidFieldMessage('Username')
            });

        case fullName.length === 0:
            return response.status(HttpBadRequestCode).json({
                mensagem: invalidFieldMessage('Nome')
            });

        case gender !== 'masculine' && gender !== 'femine' && gender !== 'non-binary':
            return response.status(HttpBadRequestCode).json({
                mensagem: invalidFieldMessage('Gênero')
            });

        case email.indexOf("@") === -1 || email.indexOf('.com') === -1:
            return response.status(HttpBadRequestCode).json({
                mensagem: invalidFieldMessage('E-mail')
            });

        case password.length < 6:
            return response.status(HttpBadRequestCode).json({
                mensagem: invalidFieldMessage('Campo de senha')
            });
    }

    next();
}

export async function checkToken(request: Request, response: Response, next: NextFunction) {
    const { token } = request.body;

    if (!token) {
        return response.status(HttpBadRequestCode).json({
            mensagem: invalidFieldMessage('Token')
        });
    }

    const userId = jwt.verify(token, process.env.SECRET_KEY!, { complete: false }, (err, decode) => {
        if (err) {
            return response.status(HttpUnauthorizedCode).json({
                mensagem: unauthorizedMessage
            });
        }

        if (typeof decode !== 'string' && typeof decode !== 'undefined') {
            return parseInt(decode.userId);
        }

        return null;
    });

    request.body.userId = userId;
    next();
}