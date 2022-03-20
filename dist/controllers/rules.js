"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchIndex = exports.postValidation = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../index");
const index_2 = require("../index");
function postValidation(postHeader, postContent, postPrivacity) {
    let validPost = false;
    let message = '';
    switch (true) {
        case postHeader.length < 3:
            message = 'Você precisa preencher o campo de Cabeçalho. O Cabeçalho deve ter 3 letras no mínimo.';
            break;
        case postContent.length < 4:
            message = 'Você precisa preencher o campo de conteúdo. O Conteúdo deve ter 4 letras no mínimo.';
            break;
        case postPrivacity !== 'private' && postPrivacity !== 'public':
            message = 'Por favor, escolha a privacidade do seu post.';
            break;
        default:
            validPost = true;
    }
    return { validPost, message };
}
exports.postValidation = postValidation;
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
        case 'userEmail':
            objectIndex = index_2.users.findIndex(user => user.email === key);
            break;
    }
    return objectIndex;
}
exports.searchIndex = searchIndex;
