import { Request, Response, NextFunction } from "express";
import { HttpUnauthorizedCode, unauthorizedMessage } from "../constants";
import 'dotenv/config';

export default function protectRoute(request: Request, response: Response, next: NextFunction) {
    const { key } = request.params;
    if (key !== process.env.apiKey) return response.status(HttpUnauthorizedCode).json({
        mensagem: unauthorizedMessage
    });

    next();
}