import { Request, Response, NextFunction } from 'express';

import { SECRET_KEY } from "../index"

export default function checkEnvironmentVariables(request: Request, response: Response, next: NextFunction) {
    if (SECRET_KEY !== 'INVALID KEY') {
        next()
    } else {
        return response.status(401).json({
            message: "Variáveis de ambiente incorretas. Fique tranquilo que nossa equipe já está cuidando disso. :)"
        })
    }
}