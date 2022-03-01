import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../index';

const generateId = function idGenerator(randomGenerator: string):string {
    const id = jwt.sign({randomGenerator}, SECRET_KEY);
    return id;
}

type Gender = 'masculine' | 'female' | 'non-binary';

export default class User {
    id: string = generateId(Math.random().toString(36).substring(2));
    token: string = '';

    constructor(public firstName: string, public lastName: string, public gender: Gender, public email: string, public phone: string, private password: string, public age: number) {}

    get getPassword() {
        return this.password;
    }

    setPassword(newPassword: string) {
        this.password = newPassword;
    }
    setToken(token: string) {
        this.token = token;
    }
    setFirstName(newFirstName: string) {
        this.firstName = newFirstName;
    }
    setLastName(newLastName: string) {
        this.firstName = newLastName;
    }
    setGender(newGender: Gender) {
        this.gender = newGender;
    }
}