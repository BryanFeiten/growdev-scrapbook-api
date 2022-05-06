"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const repositories_1 = require("../database/repositories");
class UserService {
    async find() {
        const repository = new repositories_1.UserRepository();
        const users = await repository.find();
        return users;
    }
    async findOne(id, userId) {
        const repository = new repositories_1.UserRepository();
        const user = await repository.findOne(id, userId);
        return user;
    }
    async create(userDTO) {
        const repository = new repositories_1.UserRepository();
        const user = await repository.create(userDTO);
        return user;
    }
    async update(userDTO) {
        const repository = new repositories_1.UserRepository();
        const user = await repository.update(userDTO);
        return user;
    }
    async delete(userID) {
        const repository = new repositories_1.UserRepository();
        await repository.delete(userID);
    }
    async checkUserAlready(email) {
        const repository = new repositories_1.UserRepository();
        const userId = await repository.checkUserAlready(email);
        return userId;
    }
    async checkLoginData(loginDTO) {
        const repository = new repositories_1.UserRepository();
        const userId = await repository.checkLoginData(loginDTO);
        return userId;
    }
}
exports.UserService = UserService;
