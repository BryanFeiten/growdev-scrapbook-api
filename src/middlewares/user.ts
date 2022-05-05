import { Request, Response, NextFunction, json } from 'express';
import { HttpBadRequestCode, invalidFieldMessage } from '../constants';
import { HttpError } from '../errors';
import jwt from "jsonwebtoken";
import { HttpUnauthorizedCode, unauthorizedMessage } from '../constants';
import 'dotenv/config';

export function loginFieldsValidator(request: Request, response: Response, next: NextFunction) {
    const { email, password } = request.body;   

    if (!email || !password) return response.status(HttpBadRequestCode).json(invalidFieldMessage('Campo(s) de Email ou Senha'))

    switch (true) {
        case email.indexOf("@") === -1 || email.indexOf('.co') === -1 || email.length < 7:
            throw new HttpError(invalidFieldMessage('E-mail'), HttpBadRequestCode);

        case password.length < 6:
            throw new HttpError(invalidFieldMessage('Password'), HttpBadRequestCode);
    }

    next();
}

export function createUserFieldValidator(request: Request, response: Response, next: NextFunction) {
    const { username, fullName, gender, email, password } = request.body;

    if (!username || !fullName || !gender || !email || !password) throw new HttpError(invalidFieldMessage('Campo(s) de registro não enviado(s)'), HttpBadRequestCode);

    switch (true) {
        case username.length < 4:
            throw new HttpError(invalidFieldMessage('Username'), HttpBadRequestCode);

        case fullName.length === 0:
            throw new HttpError(invalidFieldMessage('Nome'), HttpBadRequestCode);

        case gender !== 'masculine' && gender !== 'femine' && gender !== 'non-binary':
            throw new HttpError(invalidFieldMessage('Gênero'), HttpBadRequestCode);

        case email.indexOf("@") === -1 || email.indexOf('.com') === -1:
            throw new HttpError(invalidFieldMessage('E-mail'), HttpBadRequestCode);

        case password.length < 6:
            throw new HttpError(invalidFieldMessage('Password'), HttpBadRequestCode);
    }
    
    next();
}

export async function checkToken(request: Request, response: Response, next: NextFunction) {
    const { token } = request.body;

    if (!token) {
        return response.status(HttpBadRequestCode).json(invalidFieldMessage('Token'));
    }

    const userId = jwt.verify(token, process.env.SECRET_KEY!, { complete: false }, (err, decode) => {
        if (err) {
            throw new HttpError(unauthorizedMessage, HttpUnauthorizedCode);
        }

        if (typeof decode !== 'string' && typeof decode !== 'undefined') {
            return Number(decode.userId);
        }

        return null;
    });

    request.body.userId = userId;
    next();
}