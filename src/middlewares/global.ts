import { Request, Response, NextFunction } from 'express';
import { HttpUnauthorizedCode, unauthorizedMessage } from '../constants';

export const logMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const { ip, method } = request;
    console.log(ip, method);

    next();
}

export const checkEnvironmentVariables = (request: Request, response: Response, next: NextFunction) => {
    if (!process.env.PROTECT_ROUTE_KEY || !process.env.SECRET_KEY) return response.status(HttpUnauthorizedCode).json({
        mensagem: unauthorizedMessage
    });

    next()
}