import jwt from "jsonwebtoken";

import { SECRET_KEY } from "../index";
import { Privacity } from "../classes/Post";
type TypeOfContent = 'post' | 'user' | 'token' | 'userEmail';
import { users, posts } from "../index";

export function postValidation(postHeader: string, postContent: string, postPrivacity: Privacity) {
    let validPost = false;
    let message = '';

    switch (true) {
        case postHeader.length < 3:
            message = 'Você precisa preencher o campo de Cabeçalho. O Cabeçalho deve ter 3 letras no mínimo.';
            break

        case postContent.length < 4:
            message = 'Você precisa preencher o campo de conteúdo. O Conteúdo deve ter 4 letras no mínimo.';
            break

        case postPrivacity !== 'private' && postPrivacity !== 'public':
            message = 'Por favor, escolha a privacidade do seu post.';
            break

        default:
            validPost = true;
    }

    return { validPost, message };
}

export function searchIndex(typeContent: TypeOfContent, key: string) {
    let objectIndex = -1;

    switch(typeContent) {
        case 'post':
            objectIndex = posts.findIndex(post => post.id === key);
            break

        case 'user':
            objectIndex = users.findIndex(user => user.id === key);
            break

        case 'token':
            objectIndex = users.findIndex(user => {
                const decoded = jwt.verify(key, SECRET_KEY);
                return user.token === (<any>decoded).token;
            });
            break
        
        case 'userEmail':
            objectIndex = users.findIndex(user => user.email === key);
            break
    }

    return objectIndex;
}

