import jwt from 'jsonwebtoken';
import User from './User';
import { SECRET } from '../index';

type Privacity = 'private' | 'public';

const generateId = function idGenerator(userId: string):string {
    const id = jwt.sign({userId}, SECRET);
    return id;
}

export default class Post {
    id: string = generateId(this.user.id);
    constructor(public user: User, public postHeader: string, public postContent: string, public postPrivacity: Privacity) {}
}