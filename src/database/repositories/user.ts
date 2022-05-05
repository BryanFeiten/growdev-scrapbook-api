import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { UserEntity } from '../entities';
import { UserDTO, AuthLoginDTO } from '../../dto';
import { notFoundContentMessage, successProccessMessage, unauthorizedLoginMessage, userAlreadyMessage } from '../../constants';

export class UserRepository {
    async find() {
        const users = (await UserEntity.find())
            .map(user => {
                return {
                    'Username': user.username,
                    'Nome': user.fullName,
                    'Data de Nascimento': user.birthDate,
                    'Gênero': user.gender
                }
            });

        return users;
    }

    async findOne(id: number, userId: number) {
        const user = await UserEntity.findOne(id);

        if (!user) {
            return notFoundContentMessage;
        }

        if (user.id !== userId) {
            return {
                'Username': user.username,
                'Nome': user.fullName,
                'Data de Nascimento': user.birthDate,
                'Gênero': user.gender
            }
        }

        return {
            'Username': user.username,
            'Nome': user.fullName,
            'Data de Nascimento': user.birthDate,
            'Gênero': user.gender,
            'Email': user.email,
            'Senha': user.password
        };
    }

    async create(userDTO: UserDTO) {
        const user = new UserEntity(
            userDTO.username,
            userDTO.fullName,
            userDTO.gender,
            userDTO.email,
            userDTO.password,
            userDTO.birthDate
        );

        await user.save();

        return user;
    }

    async update(userDTO: UserDTO) {
        const user = await UserEntity.findOne(userDTO.id);

        if (user) {
            user.username = userDTO.username;
            user.fullName = userDTO.fullName;
            user.gender = userDTO.gender;
            user.birthDate = userDTO.birthDate;
            user.password = userDTO.password;
            await user.save();
        }

        return user;
    }

    async delete(userId: number) {
        await UserEntity.delete(userId);
    }

    async checkUserAlready(email: string) {
        const user = await UserEntity.findOne({
            where: {
                email: email
            }
        });

        if (user) {
            return userAlreadyMessage;
        }

        return successProccessMessage;
    }

    async checkLoginData(loginDTO: AuthLoginDTO) {

        const user = await UserEntity.findOne({
            where: {
                email: loginDTO.email
            }
        });

        if (user) {
            const passToCheck = user?.password;
            if (!passToCheck) return unauthorizedLoginMessage;
            if (!(await bcrypt.compare(loginDTO.password, passToCheck))) return unauthorizedLoginMessage;

            return this.generateToken(user.id!);
        }

        return unauthorizedLoginMessage;
    }

    generateToken(id: number): string {
        return this.signToken(id);
    }

    private signToken(userId: number): string {
        return jwt.sign({ userId }, process.env.SECRET_KEY!, { expiresIn: "57600000" });
    }
}