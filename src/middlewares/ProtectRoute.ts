import { Request, Response, NextFunction } from "express";
import { apiKey } from "../index";

export default function protectRoute(request: Request, response: Response, next: NextFunction) {
    const { key } = request.params;    
    
    if (key !== apiKey) {
        return response.status(401).json({
            mensagem: "Pessoa não autorizada."
        })
    }
    next();
}