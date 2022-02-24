import jwt from 'jsonwebtoken';
import { SECRET_KEY, users } from '../index';

const generateId = function idGenerator(randomGenerator: string):string {
    const id = jwt.sign({randomGenerator}, SECRET_KEY);
    return id;
}

type Gender = 'masculine' | 'female';

export default class User {
    id: string = generateId(Math.random().toString(36).substring(2));
    token: string = '';
    constructor(public firstName: string, public lastName: string, public gender: Gender, public email: string, private password: string, public age: number, public phone?: string) {}
    get getPassword() {
        return this.password;
    }
    setToken(token: string) {
        this.token = token;
    }
}