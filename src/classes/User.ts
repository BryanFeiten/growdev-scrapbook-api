import jwt from 'jsonwebtoken';
import { SECRET, users } from '../index';

const generateId = function idGenerator(randomGenerator: string):string {
    const id = jwt.sign({randomGenerator}, SECRET);
    return id;
}

type Gender = 'masculine' | 'female';

export default class User {
    id: string = generateId(Math.random().toString(36).substring(2));
    constructor(public firstName: string, public lastName: string, public gender: Gender, public email: string, private password: string, public age: number, public phone?: string) {}
}