import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors';
import { HttpUnauthorizedCode, unauthorizedMessage } from '../constants';

export const logMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const { ip, method } = request;

    console.log(ip, method);

    next();
}

export const checkEnvironmentVariables = (request: Request, response: Response, next: NextFunction) => {
    if (!process.env.PROTECT_ROUTE_KEY || !process.env.SECRET_KEY) throw new HttpError(unauthorizedMessage, HttpUnauthorizedCode);
    next()
}