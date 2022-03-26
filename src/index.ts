import express from 'express';
import 'dotenv/config';

import User from './classes/User';
import Post from './classes/Post';

const app = express();

import router from './routers/Router';

export const SECRET_KEY = process.env.SECRET_KEY || 'INVALID KEY';
export const apiKey = process.env.PROTECT_ROUTE_KEY || 'INVALID KEY';
export const userTryInvalidToken: User[] = [];

const PORT = process.env.PORT || 5000;

export const users: User[] = [];
export const posts: Post[] = [];
export const validToken: string[] = [];
export const invalidToken: string[] = [];

app.use(router);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));