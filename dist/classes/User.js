"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const generateId = function idGenerator(randomGenerator) {
    const id = jsonwebtoken_1.default.sign({ randomGenerator }, index_1.SECRET_KEY);
    return id;
};
class User {
    constructor(firstName, lastName, gender, email, phone, password, age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.age = age;
        this.id = generateId(Math.random().toString(36).substring(2));
        this.token = '';
    }
    get getPassword() {
        return this.password;
    }
    setPassword(newPassword) {
        this.password = newPassword;
    }
    setToken(token) {
        this.token = token;
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
}
exports.default = User;
