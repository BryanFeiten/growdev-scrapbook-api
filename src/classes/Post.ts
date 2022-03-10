import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../index';

export type Privacity = 'private' | 'public';

const generateId = function idGenerator(userId: string):string {
    const id = jwt.sign({userId}, SECRET_KEY);
    return id;
}

export default class Post {
    id: string = generateId(this.userId);
    
    constructor(public userId: string, public postHeader: string, public postContent: string, public postPrivacity: Privacity) {}

    setPostHeader(newPostHeader: string) {
        this.postHeader = newPostHeader;
    }
    setPostContent(newPostContent: string) {
        this.postContent = newPostContent;
    }
    setPrivacity(newPrivacity: Privacity) {
        this.postPrivacity = newPrivacity;
    }
}