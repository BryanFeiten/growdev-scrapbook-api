import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../index';
const generateId = () => Math.random().toString(36).substring(2);

const generateToken = () => {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
}

const generateRandomValue = () => Math.random().toString(36).substring(2);
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
    tempToken: Token = {
        autoToken: '',
        signToken: ''
    };
    tempTokenRefreshed: boolean = false;
    lastLoggedIp: string = '';


    constructor(public firstName: string, public lastName: string, public gender: Gender, public email: string, public phone: string, private password: string, public age: number) { }


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
        this.tempToken.signToken = '';
    }
    setLogin(ipAdress: string) {
        this.token.autoToken = generateToken();
        this.token.signToken = jwt.sign({ token: this.token.autoToken }, SECRET_KEY, { expiresIn: "57600000" });
        this.lastLoggedIp = ipAdress;
        
        const token = this.token.signToken;
        const tempToken = this.refreshToken();

        return { token, tempToken };
    }
    refreshToken() {
        this.tempToken.autoToken = generateRandomValue();
        this.tempToken.signToken = jwt.sign({ tempToken: this.tempToken.autoToken }, SECRET_KEY, { expiresIn: "600000" });
        this.tempTokenRefreshed = true;
        return this.tempToken.signToken;
    }
}