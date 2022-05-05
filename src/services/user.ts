import { UserRepository } from '../database/repositories';
import { UserDTO } from '../dto';
import { AuthLoginDTO } from '../dto';

export class UserService {
    async find() {
        const repository = new UserRepository();
        const users = await repository.find();

        return users;
    }

    async findOne(id: number, userId: number) {
        const repository = new UserRepository();
        const user = await repository.findOne(id, userId);

        return user;
    }

    async create(userDTO: UserDTO) {
        const repository = new UserRepository();
        const user = await repository.create(userDTO);

        return user;
    }

    async update(userDTO: UserDTO) {
        const repository = new UserRepository();
        const user = await repository.update(userDTO);

        return user;
    }

    async delete(userID: number) {
        const repository = new UserRepository();
        await repository.delete(userID);
    }

    async checkUserAlready(email: string) {
        const repository = new UserRepository();
        const userId = await repository.checkUserAlready(email);

        return userId;
    }

    async checkLoginData(loginDTO: AuthLoginDTO) {
        const repository = new UserRepository();
        const userId = await repository.checkLoginData(loginDTO);

        return userId;
    }
}