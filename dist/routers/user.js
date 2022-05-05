"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = __importDefault(require("../controllers/user"));
const user_2 = require("../middlewares/user");
class UserRoutes {
    init() {
        const routes = (0, express_1.Router)();
        const controller = new user_1.default();
        routes.get('/user', user_2.checkToken, controller.index);
        routes.get('/user/:id', user_2.checkToken, controller.show);
        routes.post('/user', user_2.createUserFieldValidator, controller.store);
        routes.put('/user/:id', user_2.checkToken, controller.update);
        routes.delete('/user/:id', user_2.checkToken, controller.delete);
        routes.post('/user/login', user_2.loginFieldsValidator, controller.login);
        return routes;
    }
}
exports.default = UserRoutes;
