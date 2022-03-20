"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.token = '';
        this.tempToken = '';
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
        this.token = '';
        this.tempToken = '';
    }
    setToken(ipAdress) {
        this.token = generateToken();
        this.lastLoggedIp = ipAdress;
        return this.token;
    }
    refreshToken() {
        this.tempToken = generateRandomValue();
        return this.tempToken;
    }
}
exports.default = User;
