
import { userRepository } from '../repositories/userRepository';
import { userQueryRepository } from '../repositories/userQueryRepository';
import { CreateUserDto, UserViewModel, UserDBType } from '../models/userModel';
import bcrypt from 'bcryptjs';


const SALT_ROUNDS = 10;


export const userService = {

    async getUsers(query: any) {
        return await userQueryRepository.getUsers(query);
    },

    async createUser(input: CreateUserDto): Promise<UserViewModel | { errorsMessages: { field: string; message: string }[] }> {
        const existingByLogin = await userRepository.getByLogin(input.login);
        if (existingByLogin) {
            return { errorsMessages: [{ field: 'login', message: 'login should be unique' }] };
        }
        const existingByEmail = await userRepository.getByEmail(input.email);
        if (existingByEmail) {
            return { errorsMessages: [{ field: 'email', message: 'email should be unique' }] };
        }
        const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);
        const newUser: UserViewModel = await userRepository.create(input, hashedPassword);
        return {
            id: newUser.id,
            login: newUser.login,
            email: newUser.email,
            createdAt: newUser.createdAt,
        };
    },

    async deleteUser(id: string): Promise<boolean> {
        return await userRepository.delete(id);
    },

    // поиск пользователя по логину или email
    async findUserByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
        let user = await userRepository.getByLogin(loginOrEmail);
        if (!user) {
            user = await userRepository.getByEmail(loginOrEmail);
        }
        return user;
    },

    // проверка пароля
    async verifyPassword(user: UserDBType, password: string): Promise<boolean> {
        return await bcrypt.compare(password, user.password);
    }
};