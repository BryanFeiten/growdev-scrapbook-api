import jwt from "jsonwebtoken";

import { SECRET_KEY } from "../index";
import { users, posts } from "../index";

type TypeOfContent = 'post' | 'user' | 'token' | 'tempToken' | 'userEmail';

export default function searchIndex(typeContent: TypeOfContent, key: string) {
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

        case 'tempToken':
            objectIndex = users.findIndex(user => {
                const decoded = jwt.verify(key, SECRET_KEY);
                return user.tempToken === (<any>decoded).tempToken;
            });
            break
        
        case 'userEmail':
            objectIndex = users.findIndex(user => user.email === key);
            break
    }

    return objectIndex;
}