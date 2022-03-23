import * as bcrypt from 'bcrypt';
import { users } from '../index';

export default async function checkLogin(email: string, password: string) {
    try {
        const userIndex = users.findIndex(user => user.email === email);
        const verifyPassword = await bcrypt.compare(password, users[userIndex].getPassword);

        if (userIndex !== -1 && verifyPassword) {
            return userIndex;
        } else {
            return -1;
        }
    } catch (error) {
        return -1
    }
}