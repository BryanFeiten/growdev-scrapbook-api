import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import User from './classes/User';
import jwt from 'jsonwebtoken';
export const SECRET = 'fp072307';

const app = express();
const PORT = process.env.PORT || 5000;
export const users: User[] = [];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (request: Request, response: Response) => {
    return response.status(200).json("API Running");
});

app.get('/users', (request: Request, response: Response) => {
    return response.json(users);
});

app.post('/users', (request: Request, response: Response) => {
    const {firstName, lastName,  email, password, age, phone} = request.body;
    if(firstName && lastName && email && password && age && phone) {
        const newUser = new User(firstName, lastName,  email, password, age, phone);
        users.push(newUser);
        return response.json(newUser);
    }
});
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));