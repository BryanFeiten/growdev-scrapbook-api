import { Request, Response, NextFunction } from "express";
import { HttpUnauthorizedCode, unauthorizedMessage } from "../constants";
import { HttpError } from "../errors";
import 'dotenv/config';

export default function protectRoute(request: Request, response: Response, next: NextFunction) {
    const { key } = request.params;

    if (key !== process.env.apiKey) {
        throw new HttpError(unauthorizedMessage, HttpUnauthorizedCode);
    }

    next();
}