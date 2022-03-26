import { Request, Response, NextFunction } from 'express';

import { SECRET_KEY, apiKey } from "../index"

export default function checkEnvironmentVariables(request: Request, response: Response, next: NextFunction) {
    if (apiKey !== 'INVALID KEY' && SECRET_KEY !== 'INVALID KEY') {
        next()
    } else {
        return response.status(401).json({
            message: "Variáveis de ambiente incorretas. Fique tranquilo que nossa equipe já está cuidando disso. :)"
        })
    }
}