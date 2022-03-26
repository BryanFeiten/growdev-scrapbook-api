"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const generateId = () => Math.random().toString(36).substring(2);
const generateToken = () => {
    return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
};
const generateRandomValue = () => Math.random().toString(36).substring(2);
class User {
    constructor(firstName, lastName, gender, email, phone, password, age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.age = age;
        this.id = generateId();
        this.token = {
            autoToken: '',
            signToken: ''
        };
        this.tempToken = {
            autoToken: '',
            signToken: ''
        };
        this.tempTokenRefreshed = false;
        this.lastLoggedIp = '';
    }
    get getPassword() {
        return this.password;
    }
    setPassword(newPassword) {
        this.password = newPassword;
    }
    setFirstName(newFirstName) {
        this.firstName = newFirstName;
    }
    setLastName(newLastName) {
        this.firstName = newLastName;
    }
    setGender(newGender) {
        this.gender = newGender;
    }
    setLogout() {
        this.token.signToken = '';
        this.tempToken.signToken = '';
    }
    setLogin(ipAdress) {
        this.token.autoToken = generateToken();
        this.token.signToken = jsonwebtoken_1.default.sign({ token: this.token.autoToken }, index_1.SECRET_KEY, { expiresIn: "57600000" });
        this.lastLoggedIp = ipAdress;
        const token = this.token.signToken;
        const tempToken = this.refreshToken();
        return { token, tempToken };
    }
    refreshToken() {
        this.tempToken.autoToken = generateRandomValue();
        this.tempToken.signToken = jsonwebtoken_1.default.sign({ tempToken: this.tempToken.autoToken }, index_1.SECRET_KEY, { expiresIn: "10000" });
        this.tempTokenRefreshed = true;
        return this.tempToken.signToken;
    }
}
exports.default = User;
