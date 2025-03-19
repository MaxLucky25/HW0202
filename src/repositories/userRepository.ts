import {CreateUserDto, UserDBType, UserViewModel} from "../models/userModel";
import {userCollection} from "../db/mongo-db";



export const userRepository = {

    async getById(id:string):Promise<UserViewModel | null> {
        const user =await userCollection.findOne(
            {id},
            {projection:{_id:0} }
        );
        return user as UserViewModel | null;

    },

    async getByLogin(login: string): Promise<UserDBType | null> {
        return await userCollection.findOne({ login }, { projection: { _id: 0 } });
    },

    async getByEmail(email: string): Promise<UserDBType | null> {
        return await userCollection.findOne({ email }, { projection: { _id: 0 } });
    },

    async create(input: CreateUserDto, hashedPassword: string): Promise<UserViewModel> {
        const newUser: UserDBType = {
            id: Date.now().toString(),
            login: input.login,
            password: hashedPassword,
            email: input.email,
            createdAt: new Date().toISOString()
        };
        const result = await userCollection.insertOne(newUser);
        const createdUser = await userCollection.findOne({_id: result.insertedId});
        return this.mapToOutput(createdUser!);
    },

    async delete(id: string): Promise<boolean> {
        const result = await userCollection.deleteOne({id:id});
        return result.deletedCount === 1;
    },

    mapToOutput(user: UserDBType): UserViewModel {
        const { _id, ...rest } = user;
        return rest;
    }

};

