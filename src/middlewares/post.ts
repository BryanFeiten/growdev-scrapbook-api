import { Request, Response, NextFunction } from "express";
import { HttpBadRequestCode, invalidFieldMessage } from "../constants";
import { HttpError } from "../errors";

export default function postValidation(request: Request, response: Response, next: NextFunction) {
    const { postHeader, postContent, postPrivacity } = request.body;

    switch (true) {
        case postHeader.length < 3:
            throw new HttpError(invalidFieldMessage('Cabeçalho do post está'), HttpBadRequestCode);

        case postContent.length < 4:
            throw new HttpError(invalidFieldMessage('Conteúdo do post está'), HttpBadRequestCode);

        case postPrivacity !== 'private' && postPrivacity !== 'public':
            throw new HttpError(invalidFieldMessage('A privacidade do post é'), HttpBadRequestCode);
    }

    next();
}