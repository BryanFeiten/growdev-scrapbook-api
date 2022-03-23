import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { SECRET_KEY } from "../index";
import { users } from '../index';
import searchIndex from '../utils/Search';

export default async function verifyToken(request: Request, response: Response, next: NextFunction) {
    const { tempToken, token } = request.body;

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

    jwt.verify(tempToken, SECRET_KEY, { complete: true }, error => {
        if (error) {
            jwt.verify(token, SECRET_KEY, { complete: true }, err => {
                if (err) {
                    return response.status(403).json({
                        mensagem: "Seu acesso expirou. Faça o login novamente."
                    })
                } else {
                    const refreshToken = users[userIndex].refreshToken();
                    request.body.tempToken = refreshToken;
                }
            })
        }
    });

    next();
}