import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import Database from './database/connections/Database';
import { ImplementsError, HttpError } from './errors';
import './constants';
import { HttpNotImplementedCode, notImplementedMessage } from './constants';
// import  './constants';

export default class Application {
    readonly #express: express.Application;

    constructor() {
        this.#express = express();
    }

    async init() {
        this.config();
        this.middlewares();
        this.routers();
        this.errors();
        await this.database();
    }

    start(port: number) {
        this.#express.listen(port, () => {
            console.log(`Aplicação rodando na porta ${port}...`)
        });
    }

    private config() {
        this.#express.use(express.json());
        this.#express.use(express.urlencoded({
            extended: false
        }));
        this.#express.use(cors());
    }

    private middlewares() {
        throw new HttpError(
            notImplementedMessage('Middleware'),
            HttpNotImplementedCode
        );
    }

    private errors() {
        this.#express.use((error: HttpError, request: Request, response: Response, next: NextFunction) => {
            return response.status(error.status).json({
                mensagem: error.message
            });
        });
    }

    private routers() {
        const routersPath = path.resolve(__dirname, 'routers');

        // TODO: refatorar para buscar apenas arquivos que implementar a interface HttpRouter
        fs.readdirSync(routersPath).forEach(filename => {
            import(path.resolve(routersPath, filename)).then(file => {                
                const instance = new file.default();
                this.#express.use(instance.init());      
            });
        });
    }

    private async database () {
        await Database.getInstance();
    }
}