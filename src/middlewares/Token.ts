import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";

import { SECRET_KEY, users } from "../index";
import searchIndex from '../utils/Search';

export default async function verifyToken(request: Request, response: Response, next: NextFunction) {
    const { token } = request.body;
    const ip = request.ip;
    
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

    if (ip !== users[userIndex].lastLoggedIp) {
        return response.status(403).json({
            mensagem: "Você estava logado em outro ip. Faça o login novamente."
        })
    }
    
    jwt.verify(token, SECRET_KEY, { complete: true }, err => {
        if (err) {
            return response.status(403).json({
                mensagem: "Seu acesso expirou. Faça o login novamente."
            })
        }
    })

    next();
}