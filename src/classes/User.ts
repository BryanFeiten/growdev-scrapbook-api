import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../index';

const generateId = () => Math.random().toString(36).substring(2);

const generateToken = () => {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

type Token = {
    autoToken: string,
    signToken: string
}

type Gender = 'masculine' | 'female' | 'non-binary';
export default class User {
    id: string = generateId();
    token: Token = {
        autoToken: '',
        signToken: ''
    };
    lastLoggedIp: string = '';


    constructor(public firstName: string, public lastName: string, public gender: Gender, public email: string, public phone: string, private password: string, public age: number) {}

    get getPassword() {
        return this.password;
    }

    setPassword(newPassword: string) {
        this.password = newPassword;
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


    setLogout() {
        this.token.signToken = '';
    }

    setLogin(ipAdress: string) {
        this.token.autoToken = generateToken();
        this.token.signToken = jwt.sign({ token: this.token.autoToken }, SECRET_KEY, { expiresIn: "57600000" });
        this.lastLoggedIp = ipAdress;
        
        const token = this.token.signToken;

        return token;
    }
}