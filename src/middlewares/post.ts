import { Request, Response, NextFunction } from "express";
import { HttpBadRequestCode, invalidFieldMessage } from "../constants";

export default function postValidation(request: Request, response: Response, next: NextFunction) {
    const { postHeader, postContent, postPrivacity } = request.body;

    if (!postHeader || !postContent || !postPrivacity) return response.status(HttpBadRequestCode).json({
        mensagem: invalidFieldMessage('Campo(s) para criação do post')
    });

    switch (true) {
        case postHeader.length < 3:
            return response.status(HttpBadRequestCode).json({
                mensagem: invalidFieldMessage('Cabeçalho do post está')
            });

        case postContent.length < 4:
            return response.status(HttpBadRequestCode).json({
                mensagem: invalidFieldMessage('Conteúdo do post está')
            });

        case postPrivacity !== 'private' && postPrivacity !== 'public':
            return response.status(HttpBadRequestCode).json({
                mensagem: invalidFieldMessage('A privacidade do post é')
            });
    }

    next();
}