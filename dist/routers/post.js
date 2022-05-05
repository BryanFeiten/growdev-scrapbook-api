"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../middlewares/user");
const post_1 = __importDefault(require("../controllers/post"));
const post_2 = __importDefault(require("../middlewares/post"));
class PostRoutes {
    init() {
        const routes = (0, express_1.Router)();
        const controller = new post_1.default();
        routes.get('/post', user_1.checkToken, controller.index);
        routes.get('/post/:id', user_1.checkToken, controller.show);
        routes.post('/post', [user_1.checkToken, post_2.default], controller.store);
        routes.put('/post/:id', [user_1.checkToken, post_2.default], controller.update);
        routes.delete('/post/:id', user_1.checkToken, controller.delete);
        return routes;
    }
}
exports.default = PostRoutes;
