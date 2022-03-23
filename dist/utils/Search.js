"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const index_2 = require("../index");
function searchIndex(typeContent, key) {
    let objectIndex = -1;
    switch (typeContent) {
        case 'post':
            objectIndex = index_2.posts.findIndex(post => post.id === key);
            break;
        case 'user':
            objectIndex = index_2.users.findIndex(user => user.id === key);
            break;
        case 'token':
            objectIndex = index_2.users.findIndex(user => {
                const decoded = jsonwebtoken_1.default.verify(key, index_1.SECRET_KEY);
                return user.token === decoded.token;
            });
            break;
        case 'tempToken':
            objectIndex = index_2.users.findIndex(user => {
                const decoded = jsonwebtoken_1.default.verify(key, index_1.SECRET_KEY);
                return user.tempToken === decoded.tempToken;
            });
            break;
        case 'userEmail':
            objectIndex = index_2.users.findIndex(user => user.email === key);
            break;
    }
    return objectIndex;
}
exports.default = searchIndex;
