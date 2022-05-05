"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const entities_1 = require("../entities");
const constants_1 = require("../../constants");
class UserRepository {
    async find() {
        const users = (await entities_1.UserEntity.find())
            .map(user => {
            return {
                'Username': user.username,
                'Nome': user.fullName,
                'Data de Nascimento': user.birthDate,
                'Gênero': user.gender
            };
        });
        return users;
    }
    async findOne(id, userId) {
        const user = await entities_1.UserEntity.findOne(id);
        if (!user) {
            return constants_1.notFoundContentMessage;
        }
        if (user.id !== userId) {
            return {
                'Username': user.username,
                'Nome': user.fullName,
                'Data de Nascimento': user.birthDate,
                'Gênero': user.gender
            };
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
    async create(userDTO) {
        const user = new entities_1.UserEntity(userDTO.username, userDTO.fullName, userDTO.gender, userDTO.email, userDTO.password, userDTO.birthDate);
        await user.save();
        return user;
    }
    async update(userDTO) {
        const user = await entities_1.UserEntity.findOne(userDTO.id);
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
    async delete(userId) {
        await entities_1.UserEntity.delete(userId);
    }
    async checkIfUserExists(loginDTO) {
        const user = await entities_1.UserEntity.findOne({
            where: {
                email: loginDTO.email
            }
        });
        if (user) {
            const passToCheck = user?.password;
            if (!passToCheck)
                return constants_1.unauthorizedLoginMessage;
            if (!(await bcrypt.compare(loginDTO.password, passToCheck)))
                return constants_1.unauthorizedLoginMessage;
            return this.generateToken(user.id);
        }
        return constants_1.unauthorizedLoginMessage;
    }
    generateToken(id) {
        return this.signToken(id);
    }
    signToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "57600000" });
    }
}
exports.UserRepository = UserRepository;
